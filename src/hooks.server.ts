import { TWITCH_ID_COOKIE_NAME, TWITCH_REFRESH_TOKEN_COOKIE_NAME, TWITCH_TOKEN_COOKIE_NAME } from '$env/static/private';

export async function handle({event,resolve}) {

    const twitchToken = event.cookies.get(TWITCH_TOKEN_COOKIE_NAME);
    const twitchId = event.cookies.get(TWITCH_ID_COOKIE_NAME);
    const refresh_token = event.cookies.get(TWITCH_REFRESH_TOKEN_COOKIE_NAME);
    if (twitchToken && twitchId && refresh_token) {
        event.locals.twitchCredentials = {
            token: twitchToken,
            userId: twitchId,
            refreshToken: refresh_token
        }
    } else {
        event.locals.twitchCredentials = null;
    }
    return await resolve(event);
     
}