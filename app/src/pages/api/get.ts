import type { APIRoute, APIContext } from 'astro';
import demo from '@/lib/demo';

function validateString(str: string): boolean {
    const regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+\d{3}$/;
    return regex.test(str);
}

export const GET: APIRoute = async ({ request, locals }: APIContext) => {
    const address = new URL(request.url).searchParams.get('address');
    if (import.meta.env.DEV) {
        return new Response(JSON.stringify(demo));
    }
    if (address === undefined || address === '') {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "'address' query required!",
        }));
    }

    const addresName = (address || '').split('@')[0];
    if (!validateString(addresName)) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "'address' query invalid!",
        }));
    }

    // get mails with prefix (user@example.com) - suffix (-8dh2m901) acts as identifier
    const mailKeys = await locals.runtime.env.POST_DB?.get(`${address}-keys`);
    const statsCount = await locals.runtime.env.POST_DB?.get('stats-count');
    let mailKeysArr: string[] = [];
    try {
        mailKeysArr = JSON.parse(mailKeys || '[]');
    } catch (error) {
        //
    }

    // if no emails are stored under the prefix key, return empty json
    if (!mailKeys || mailKeysArr.length === 0) {
        return new Response(JSON.stringify({
            status: 'ok',
            code: 200,
            msg: 'No available emails',
            stats: {
                count: statsCount,
            },
            mails: [],
        }));
    }

    // create array of received mails
    let mails = [];
    for (const key of mailKeysArr) {
        const mail_res = await locals.runtime.env.POST_DB.get(`${address}-${key}`);
        // convert string back to JSON
        // @ts-ignore
        if (mail_res) mails.push(JSON.parse(mail_res));
    }

    return new Response(JSON.stringify({
        status: 'ok',
        code: 200,
        msg: 'Mail available',
        stats: {
            count: statsCount,
        },
        mails,
    }));
};
