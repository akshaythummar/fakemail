import type { APIRoute, APIContext } from 'astro';

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
    const { message_id, is_read } = await request.json();
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
    const readStatus = +is_read === 0 ? 0 : 1;
    const stmt = locals.runtime.env.MAIL_DB?.prepare(`
INSERT OR REPLACE INTO email_status 
(email_id, user_id, is_read, created_at, updated_at)
SELECT 
    e.id,
    ?,
    ?,
    COALESCE((SELECT created_at FROM email_status WHERE email_id = e.id AND user_id = ?), CURRENT_TIMESTAMP),
    CURRENT_TIMESTAMP
FROM emails e
JOIN user_email_addresses uea ON e.user_email_id = uea.id
WHERE e.message_id = ? 
AND uea.user_id = ?
    `).bind(userId, readStatus, userId, message_id, userId);
    await stmt.run().catch(error => console.log(error));
    return new Response(
        JSON.stringify({
            status: 'ok',
            code: 200,
            msg: 'Success',
        })
    );
}