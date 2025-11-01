export async function handle({event,resolve}) {

    // Retrieve twitch credentials from cookies
    const token = event.cookies.get('twitch_access_token');
    const expiresAt = Number(event.cookies.get('twitch_token_duration'));
    const userId = event.cookies.get('twitch_user_id');
    const userLogin = event.cookies.get('twitch_user_login');
    const refreshToken = event.cookies.get('twitch_refresh_token');

    if(token&&expiresAt && userId && userLogin && refreshToken) {
        event.locals.credentials = {
            twitch: {
                token,
                expiresAt,
                userId,
                userLogin,
                refreshToken,
            }
        }
    }else {
        event.locals.credentials = {
            ...event.locals.credentials,
            twitch: null
        }
    }
    return await resolve(event);
     
}