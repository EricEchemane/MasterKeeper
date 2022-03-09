import { client } from "$lib/client";
import { getBaseUrl, getToken } from "$lib/util/validators";

const baseUrl = getBaseUrl();

const invalidReq = {
    status: 400,
    body: { error: 'Invalid request' }
};

export async function post({ request }) {
    const body = await request.json();
    if (!body || !body.id) return invalidReq;
    if (!getToken(request)) return Response.redirect(`${baseUrl}create`, 303);

    try {
        const deleted = await client.account.delete({ where: { id: body.id } });
        return { status: 200, body: { deleted } };
    } catch (error) {
        return { status: 500, body: { message: 'Internal server error', error } };
    }
}