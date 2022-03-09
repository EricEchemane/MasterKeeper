import { getBaseUrl } from "$lib/util/validators";

export async function handle({ event, resolve }) {
    const reqCookie = event.request.headers.get('cookie');
    const cookieName = 'userid';
    const keeperCookie = reqCookie
        ? reqCookie.split(';').find((c: string) => c.trim().startsWith(cookieName))
        : null;

    // const response = await resolve(event);
    // return response;

    const currentUrl = event.request.url;
    const response = await resolve(event);

    if (!reqCookie || !keeperCookie) {

        if (currentUrl.startsWith(getBaseUrl() + 'me')) {
            return Response.redirect(`${getBaseUrl()}`, 303);
        }
        return response;
    }
    else if (currentUrl === getBaseUrl()) {
        return Response.redirect(`${getBaseUrl()}me`, 303);
    }
    else return response;
}
