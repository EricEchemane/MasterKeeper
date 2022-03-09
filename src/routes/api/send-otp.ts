import { client } from '$lib/client';
import { validateEmail } from '$lib/util/validators';
import nodemailer from 'nodemailer';

export async function post({ request }) {
    const body = await request.json();
    if (!body || !body.email || !body.passcode || !validateEmail(body.email)) {
        return {
            status: 400,
            body: {
                error: 'Invalid request'
            }
        };
    }

    const emailAlreadyUsed = await client.user.findFirst({
        where: { master_email: body.email }
    });
    if (emailAlreadyUsed) return {
        status: 400,
        body: { message: 'Email already used' }
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eechemane29@gmail.com',
            pass: 'lljlnnexpxczqctd'
        }
    });

    const mailOptions = {
        from: 'eechemane29@gmail.com',
        to: body.email,
        subject: 'MasterKeeper One Time Passcode',
        html: `
            <h1> ${body.passcode}</h1>
            <p> Your One Time Passcode: ${new Date()} </p>
            <pre> MasterKeeper &copy; 2022 </pre>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return {
            body: { message: 'OTP sent', info: info }
        };
    } catch (error) {
        return {
            status: 500,
            body: { message: 'failed', error: error }
        };

    }
}