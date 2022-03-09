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
    if (!body || !body.nickname || !body.master_avatar || !body.masterPassword) return invalidReq;

    const token = getToken(request);
    if (!token) return Response.redirect(`${baseUrl}create`, 303);

    try {
        const userId = jwt.verify(token, process.env.KEEPER);
        const updated = await client.user.update({
            where: { id: String(userId) },
            data: {
                nickname: body.nickname,
                master_avatar: body.master_avatar,
            }
        });
        return { status: 200, body: { updated } };

    } catch (error) {
        console.log(error);

        return { status: 500, body: { message: 'Internal server error', error } };
    }
}