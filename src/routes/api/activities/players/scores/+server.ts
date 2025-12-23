import { getUserFromCookies } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	return json(user.activities.players.map((p) => ({ name: p.name, score: p.score })));
}
