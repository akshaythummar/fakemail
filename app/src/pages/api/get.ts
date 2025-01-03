import type { APIRoute } from 'astro';

const url = 'https://temp-mail-service.wonderful563.workers.dev/';

export const get: APIRoute = async ({ request }) => {
    const address = new URL(request.url).searchParams.get('address');
    const response = await fetch(`${url}/mail/get?address=${address}`);
    return response;
};