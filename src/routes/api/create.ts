import { client } from "$lib/client";
import { hash } from "$lib/util/hashing";
import { validateEmail } from "$lib/util/validators";

export async function post({ request }) {
    const body = await request.json();
    if (
        !body ||
        !body.email ||
        !validateEmail(body.email) ||
        !body.nickname ||
        !body.password
    ) {
        return {
            status: 400,
            body: {
                error: 'Invalid request'
            }
        };
    }
    try {
        const hashedPassword = await hash(body.password);
        const newUser = {
            master_email: body.email,
            nickname: body.nickname,
            master_password: hashedPassword,
            master_avatar: ''
        };

        const createdUser = await client.user.create({ data: newUser });
        return {
            status: 201,
            body: {
                user: createdUser
            }
        };
    } catch (error) {
        return {
            status: 500,
            body: {
                message: 'Internal server error', error: error
            }
        };
    }
}