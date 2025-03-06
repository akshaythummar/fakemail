import type { APIRoute, APIContext } from 'astro';

export const GET: APIRoute = async ({ request, locals }: APIContext) => {
    const id = new URL(request.url).searchParams.get('id');
    if (id === undefined || id === '') {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "'id' query required!",
        }));
    }
    const { userId } = locals.auth();
    if (!userId) {
        // redirect to login page
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 502,
            msg: "please login!",
        }));
    }
    const stmt = locals.runtime.env.MAIL_DB?.prepare('Select id from user_email_addresses where user_id = ? and id = ?').bind(userId, id);
    const returnValue = await stmt.run().catch((e) => {
        console.error(e);
        return { results: [] };
    });
    if (returnValue.results.length === 0) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "Email not found!",
        }));
    }
    const stmt2 = locals.runtime.env.MAIL_DB?.prepare('SELECT e.message_id, e.subject, e.cc, e.sender_name, e.sender, e.body_text, e.body_html, e.received_at, es.is_read FROM emails e JOIN email_status es ON es.email_id = e.id WHERE user_email_id = ? ORDER BY received_at DESC').bind(id);
    const returnValue2 = await stmt2.run().catch((e) => {
        console.error(e);
        return { results: [] };
    });
    return new Response(JSON.stringify({
        status: 'ok',
        code: 200,
        msg: 'Mail available',
        mails: returnValue2.results.map(row => {
            return {
                message_id: row.message_id as string,
                subject: row.subject as string,
                sender: row.sender as string,
                senderName: row.sender_name as string,
                cc: row.cc as string,
                content: (row.body_text || row.body_html) as string,
                received_at: row.received_at as string,
                is_read: row.is_read as number
            }
        })
    }));
};