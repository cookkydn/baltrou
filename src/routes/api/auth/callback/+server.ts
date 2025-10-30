import { TWITCH_CLIENT_SECRET, TWITCH_ID_COOKIE_NAME, TWITCH_REFRESH_TOKEN_COOKIE_NAME, TWITCH_TOKEN_COOKIE_NAME } from '$env/static/private';
import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import { getTwitchUserInfo } from '$lib/server/twitch/user';
import { redirect } from '@sveltejs/kit';


/**
 * Gère la requête GET de redirection de Twitch après l'autorisation de l'utilisateur.
 * @type {import('./$types').RequestHandler}
*/
export async function GET({ url, cookies, fetch, locals }) {
    const REDIRECT_URI = `${url.origin}/api/auth/callback`;
	const code = url.searchParams.get('code');
    
	if (!code) {
		console.error('Missing code in OAuth callback');
		throw redirect(302, '/login'); 
	}

	const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: PUBLIC_TWITCH_CLIENT_ID, 
			client_secret: TWITCH_CLIENT_SECRET,
			code: code,
			grant_type: 'authorization_code',
			redirect_uri: REDIRECT_URI
		})
	});

	if (!tokenResponse.ok) {
		console.error('Twitch token exchange failed:', await tokenResponse.text());
		throw redirect(302, '/login');
	}

	const tokenData = await tokenResponse.json();
    
	cookies.set(TWITCH_TOKEN_COOKIE_NAME, tokenData.access_token, {
		path: '/',
		maxAge: tokenData.expires_in,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
    
    cookies.set(TWITCH_REFRESH_TOKEN_COOKIE_NAME, tokenData.refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30 * 6, // 6 mois
        httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
    });

    const user = await getTwitchUserInfo(tokenData.access_token);
    if (user) {
        locals.twitchUser = user;
        cookies.set(TWITCH_ID_COOKIE_NAME, user.id, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30 * 6, // 6 mois
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
    } else {
        console.error("Unable to retreive user info")
        cookies.delete(TWITCH_TOKEN_COOKIE_NAME,{path: '/'});
        cookies.delete(TWITCH_REFRESH_TOKEN_COOKIE_NAME,{path: '/'});
        cookies.delete(TWITCH_ID_COOKIE_NAME,{path: '/'});
        throw redirect(302, '/login');
    }

	throw redirect(302, '/');
}