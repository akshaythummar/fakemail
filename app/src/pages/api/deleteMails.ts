import type { APIRoute, APIContext } from 'astro';

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
    const { message_id } = await request.json();
    if (message_id === undefined || message_id === '') {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "'message_id' query required!",
        }));
    }
    const { userId } = locals.auth();
    if (!userId) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "please login!",
        }));
    }
    await locals.runtime.env.MAIL_DB?.batch([
        locals.runtime.env.MAIL_DB?.prepare('DELETE FROM email_tag_relations WHERE email_id = (SELECT id FROM emails WHERE message_id = ?)').bind(message_id),
        locals.runtime.env.MAIL_DB?.prepare('DELETE FROM email_status WHERE email_id = (SELECT id FROM emails WHERE message_id = ?) AND user_id = ?').bind(message_id, userId),
        locals.runtime.env.MAIL_DB?.prepare('DELETE FROM emails WHERE message_id = ?').bind(message_id)
    ]);
    return new Response(
        JSON.stringify({
            status: 'ok',
            code: 200,
            msg: 'Success',
        })
    );
}