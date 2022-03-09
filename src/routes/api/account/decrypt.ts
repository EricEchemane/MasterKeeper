import { client } from "$lib/client";
import { verifyHash } from "$lib/util/hashing";
import { getBaseUrl, getToken } from "$lib/util/validators";
import jwt from "jsonwebtoken";

const baseUrl = getBaseUrl();

const invalidReq = {
    status: 400,
    body: { error: 'Invalid request' }
};

export async function post({ request }) {
    const body = await request.json();
    if (!body || !body.username || !body.password || !body.masterPassword) return invalidReq;

    const token = getToken(request);
    if (!token) return Response.redirect(`${baseUrl}create`, 303);

    try {
        const { username, password, masterPassword } = body;

        const userId = jwt.verify(token, process.env.KEEPER);
        const user = await client.user.findUnique({ where: { id: String(userId) } });
        if (!user) return Response.redirect(`${baseUrl}create`, 303);

        const correct = await verifyHash(user.master_password, masterPassword);
        if (!correct) return { status: 401, body: { message: 'Incorrect master password' } };

        return {
            status: 200,
            body: {
                username: jwt.verify(username, masterPassword),
                password: jwt.verify(password, masterPassword),
            }
        };

    } catch (error) {
        return { status: 500, body: { message: 'Invalid' } };
    }
}