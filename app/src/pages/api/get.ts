import type { APIRoute, APIContext } from 'astro';
import demo from '@/lib/demo';

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

    // get mails with prefix (user@example.com) - suffix (-8dh2m901) acts as identifier
    const res = await locals.runtime.env.POST_DB?.list({ prefix: address });
    const statsCount = await locals.runtime.env.POST_DB?.get('stats-count');

    // if no emails are stored under the prefix key, return empty json
    if (!res || res['keys'].length === 0) {
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
    for (const key of res['keys']) {
        const mail_res = await locals.runtime.env.POST_DB.get(key['name']);
        // convert string back to JSON
        // @ts-ignore
        mails.push(JSON.parse(mail_res));
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
