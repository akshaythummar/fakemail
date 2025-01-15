import { generate } from 'random-words';
import type { APIRoute, APIContext } from 'astro';

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
    const domain = '@fakeact.fun';
    const { remark } = await request.json();
    const { userId } = locals.auth();
    if (!userId) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "please login!",
        }));
    }
    const stmt = locals.runtime.env.MAIL_DB?.prepare('Select count(*) from user_email_addresses where user_id = ?').bind(userId);
    const returnValue = await stmt.run().catch((e) => {
        console.error(e);
        return { results: [] };
    });
    const results = returnValue.results as { 'count(*)': number }[];
    if (results[0]['count(*)'] >= 5) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "You can't create more than 5 accounts!",
        }));
    }
    const words = generate({ exactly: 2, maxLength: 5 });
    const alt = words[0] + '.' + words[1] + Math.floor(Math.random() * 1000) + domain;
    const stmt2 = locals.runtime.env.MAIL_DB?.prepare('Insert into user_email_addresses (user_id, email_address, alias) values (?, ?, ?)').bind(userId, alt, remark);
    await stmt2.run().catch((e) => {
        console.error(e);
    });
    return new Response(
        JSON.stringify({
            status: 'ok',
            code: 200,
            msg: 'Success',
        })
    );
};