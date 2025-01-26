// @ts-ignore
import PostalMime from 'postal-mime';
import insertMails from './insertMails';

export interface Env {
    POST_DB: KVNamespace;
    MAIL_DB: D1Database;
}

interface AccoutAddress {
    id: number;
    user_id: string;
}

export default {
    async email(message: ForwardableEmailMessage, env: Env) {
        // parse ReadableStream message to email
        const parser = new PostalMime();
        const body = await new Response(message.raw).arrayBuffer();
        const email = await parser.parse(body);

        // count email for statistics
        let prev_count = await env.POST_DB.get('stats-count');
        if (prev_count === null) {
            prev_count = '0';
        }
        await env.POST_DB.put('stats-count', String(parseInt(prev_count) + 1));

        const sender = email.from.address;
        const senderName = email.from.name;
        const recipient = email.to?.length ? email.to[0].address : '';

        if (!recipient) return;

        // generate random string (len = 8)
        const suffix = Math.random().toString(16).slice(2, 10);

        // get D1 email address
        const stmt = env.MAIL_DB.prepare('SELECT id, user_id FROM user_email_addresses WHERE email_address = ?').bind(recipient);
        const returnValue = await stmt.run().catch((e) => {
            console.error(e);
            return { results: [] as AccoutAddress[] };
        });

        if (returnValue.results.length > 0) {
            // if email exists in D1, insert email to D1
            const { id, user_id } = returnValue.results[0] as AccoutAddress;
            await insertMails({
                mail_id: id,
                user_id: user_id,
                message_id: email.messageId || `${recipient}-${suffix}`,
                subject: email.subject || '',
                sender: sender || '',
                senderName: senderName || '',
                recipient,
                content_type: 'text/html',
                body_text: email.text || '',
                body_html: email.html || '',
                received_at: email.date || new Date().toISOString(),
                cc: email.cc?.map((cc) => cc.address).join(',') || '',
                bcc: email.bcc?.map((bcc) => bcc.address).join(',') || '',
            }, env);
            return;
        }

        let keys = await env.POST_DB.get(`${recipient}-keys`);
        if (!keys) {
            keys = JSON.stringify([suffix]);
        } else {
            const _keys = JSON.parse(keys);
            _keys.push(suffix);
            keys = JSON.stringify(_keys);
        }
        await env.POST_DB.put(`${recipient}-keys`, keys, {
            expirationTtl: 7200,
        });
        // make key address followed by suffix (user@example.com-8dh2m901)
        // suffix acts as the key, while the email is used for assignment
        const key = recipient + '-' + suffix;

        let formatted_content = email.text?.replaceAll('\n', '<br>');

        // for an example email JSON see example.json
        const data = {
            suffix: suffix,
            recipient: recipient,
            sender: sender,
            name: senderName,
            subject: email.subject,
            'content-plain': email.text,
            'content-plain-formatted': formatted_content,
            'content-html': email.html,
            date: email.date,
        };

        await env.POST_DB.put(key, JSON.stringify(data), {
            expirationTtl: 7200,
        });
    },
};
