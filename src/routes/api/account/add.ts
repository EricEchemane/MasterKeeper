import { client } from "$lib/client";
import { verifyHash } from "$lib/util/hashing";
import { getBaseUrl, getToken } from "$lib/util/validators";
import jwt from "jsonwebtoken";

const baseUrl = getBaseUrl();

const invalidReq = {
    status: 400,
    body: {
        error: 'Invalid request'
    }
};

export async function post({ request }) {
    const body = await request.json();
    if (!body) return invalidReq;
    const { accountLabel, username, password, url, masterPassword } = body;
    if (!accountLabel || !username || !password || !masterPassword) return invalidReq;

    const token = getToken(request);
    if (!token) return Response.redirect(`${baseUrl}create`, 303);

    try {
        const userId = jwt.verify(token, process.env.KEEPER);
        const user = await client.user.findUnique({
            where: { id: String(userId) }
        });
        if (!user) return Response.redirect(`${baseUrl}create`, 303);

        const correct = await verifyHash(user.master_password, masterPassword);
        if (!correct) return { status: 401, body: { message: 'Incorrect master password' } };

        const account = await client.account.create({
            data: {
                account_label: accountLabel,
                password: jwt.sign(password, masterPassword),
                username: jwt.sign(username, masterPassword),
                owner: { connect: { id: user.id } },
                url: url
            }
        });

        if (account) return { status: 200, body: { account } };
        else return { status: 500, body: { message: 'Account creation failed' } };
    }
    catch (error) {
        return { status: 500, body: { message: 'Internal server error' } };
    }
}