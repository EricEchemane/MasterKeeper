export function validateEmail(email: string) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

export function getToken(request: any) {
    const reqCookie = request.headers.get('cookie');
    if (!reqCookie) return null;
    const cookieName = 'userid';
    const keeperCookie = reqCookie
        ? reqCookie.split(';').find((c: string) => c.trim().startsWith(cookieName))
        : null;
    if (!keeperCookie) return null;
    const token = keeperCookie.substring(cookieName.length + 1);
    return token;
}

export function getBaseUrl() {
    return process.env.NODE_ENV === 'production' ?
        'https://masterkeeper.herokuapp.com/' : 'http://localhost:3000/';
}