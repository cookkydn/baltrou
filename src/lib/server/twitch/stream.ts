import type { TwitchGetStreamsRes } from '$lib/types/twitch';
import { twitchFetch } from './fetch';

export async function getStreamState(
	token: string,
	userLogin: string
): Promise<TwitchGetStreamsRes> {
	if (!token || !userLogin) {
		console.error('sendChatMessage: Missing token, user ID, or message content.');
		return { data: [] };
	}

	const response = await twitchFetch<TwitchGetStreamsRes>(
		'streams',
		token,
		{
			method: 'GET'
		},
		{
			user_login: userLogin
		}
	);
	
	return response;
}
