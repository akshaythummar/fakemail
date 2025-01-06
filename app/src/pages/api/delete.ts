import type { APIRoute, APIContext } from 'astro';

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
    const { key } = await request.json();
    if (!key) {
        return new Response(JSON.stringify({
            status: 'bad request',
            code: 400,
            msg: "'key' params required!",
        }));
    }
    
    await locals.runtime.env.POST_DB?.delete(key);

    return new Response(
        JSON.stringify({
            status: 'ok',
            code: 200,
            msg: 'Mail deleted',
        })
    );
};
