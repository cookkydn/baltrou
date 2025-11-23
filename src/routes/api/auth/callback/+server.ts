import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { addUser, getTwitchUserInfo, getUser, updateCredentials } from '$lib/server/user';
import { TwitchApiError } from '$lib/types/twitch.js';
import { redirect } from '@sveltejs/kit';

/**
 * Gère la requête GET de redirection de Twitch après l'autorisation de l'utilisateur.
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url, cookies, fetch }) {
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
			client_id: env.TWITCH_CLIENT_ID,
			client_secret: env.TWITCH_CLIENT_SECRET,
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
	const user = await getTwitchUserInfo(tokenData.access_token);
	if (!user) {
		console.error('Failed to fetch twitch user info');
		cookies.delete('user_id', { path: '/' });
		throw new TwitchApiError(404, 'Could not retreive twitch user info');
	}
	if ((await getUser(user.id)) != null) {
		updateCredentials(user.id, {
			access_token: tokenData.access_token,
			expires_in: new Date(Date.now() + tokenData.expires_in * 1000),
			refresh_token: tokenData.refresh_token
		});
	} else {
		await addUser({
			id: user.id,
			user_login: user.login,
			credentials: {
				access_token: tokenData.access_token,
				expires_in: new Date(Date.now() + tokenData.expires_in * 1000),
				refresh_token: tokenData.refresh_token
			}
		});
	}

	cookies.set('user_id', user.id, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7
	});
	throw redirect(302, '/');
}
