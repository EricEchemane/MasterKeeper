import { client } from "$lib/client";
import { verifyHash } from "$lib/util/hashing";
import { validateEmail } from "$lib/util/validators";
import jwt from 'jsonwebtoken';

export async function post({ request }) {
    const body = await request.json();
    if (
        !body ||
        !body.email ||
        !validateEmail(body.email) ||
        !body.password
    ) {
        return {
            status: 400,
            body: { error: 'Invalid request' }
        };
    }

    try {
        const user = await client.user.findFirst({ where: { master_email: body.email } });
        if (!user) return {
            status: 404,
            body: {
                message: "Something is incorrect"
            }
        };

        const correct = await verifyHash(user.master_password, body.password);
        if (!correct) return {
            status: 404,
            body: {
                message: "Something is incorrect"
            }
        };

        const token = jwt.sign(user.id, process.env.KEEPER);
        return { status: 200, body: { token } };

    } catch (error) {
        console.log(error);

        return {
            status: 500,
            body: {
                message: 'Internal server error', error: error
            }
        };
    }
}