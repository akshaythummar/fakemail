import type { APIRoute, APIContext } from 'astro';

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
    const { id, remark } = await request.json();
    if (!id) return new Response(JSON.stringify({
        status: 'bad request',
        code: 400,
        msg: "id is required!",
    }));
    if ((remark || '').length > 400) return new Response(JSON.stringify({
        status: 'bad request',
        code: 400,
        msg: "remark is too long!",
    }));
    const { userId } = locals.auth();
    if (!userId) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "please login!",
        }));
    }
    const stmt = locals.runtime.env.MAIL_DB?.prepare('Update user_email_addresses set alias = ? where user_id = ? and id = ?').bind(remark, userId, id);
    const msg = await stmt.run().then(() => {
        return {
            status: 'ok',
            code: 200,
            msg: 'Success',
        }
    }).catch((e) => {
        console.error(e);
        return {
            status: 'bad request',
            code: 400,
            msg: 'Something wrong or exists, please try again!',
        }
    });
    return new Response(JSON.stringify(msg));
};