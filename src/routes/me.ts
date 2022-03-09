import { client } from "$lib/client";
import { getBaseUrl, getToken } from "$lib/util/validators";
import jwt from 'jsonwebtoken';

const baseUrl = getBaseUrl();

export async function get({ request }) {
    const token = getToken(request);
    if (!token) return Response.redirect(`${baseUrl}create`, 303);

    try {
        const userId = jwt.verify(token, process.env.KEEPER);
        const user = await client.user.findUnique({
            where: { id: String(userId) },
            include: { accounts: true }
        });
        if (!user) return Response.redirect(`${baseUrl}create`, 303);
        return {
            body: {
                user: {
                    nickname: user.nickname,
                    master_email: user.master_email,
                    master_avatar: user.master_avatar,
                    accounts: user.accounts
                }
            }
        };
    }
    catch (error) {
        return Response.redirect(`${baseUrl}create`, 303);
    }
}