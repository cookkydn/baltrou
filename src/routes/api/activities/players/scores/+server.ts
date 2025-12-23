import { getUserFromCookies } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	return new Response(
		JSON.stringify(
			user.activities.players.map((p) => ({
				name: p.name,
				score: p.score,
				avatar: p.profilePictureUrl
			}))
		),
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		}
	);
}
