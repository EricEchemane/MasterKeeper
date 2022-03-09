import { client } from "$lib/client";
import { getBaseUrl, getToken } from "$lib/util/validators";
import jwt from "jsonwebtoken";

const baseUrl = getBaseUrl();

const invalidReq = {
    status: 400,
    body: { error: 'Invalid request' }
};

export async function post({ request }) {
    const body = await request.json();
    if (!body || !body.username ||
        !body.password || !body.masterPassword ||
        !body.account_label || !body.id) return invalidReq;

    const token = getToken(request);
    if (!token) return Response.redirect(`${baseUrl}create`, 303);

    try {
        const updated = await client.account.update({
            where: { id: body.id },
            data: {
                username: jwt.sign(body.username, body.masterPassword),
                password: jwt.sign(body.password, body.masterPassword),
                url: body.url || '',
                account_label: body.account_label
            }
        });
        return { status: 200, body: { updated } };

    } catch (error) {
        return { status: 500, body: { message: 'Internal server error', error } };
    }
}