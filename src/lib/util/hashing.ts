import argon2 from 'argon2';

export async function hash(password: string) {
    return (await argon2.hash(password, { type: argon2.argon2id }));
}

export async function verifyHash(hashedPassword: string, password: string) {
    const correct = await argon2.verify(hashedPassword, password);
    return correct;
}