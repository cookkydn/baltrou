import { addPlayer, getPlayers } from '$lib/server/activities/players.js';
import { getUserFromCookies } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';

export async function POST({ cookies, request }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	const { playerName }: { playerName: string } = await request.json();
	const player = await addPlayer(user.id, playerName.toLowerCase());
	return json(player);
}

export async function GET({ cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	const players = await getPlayers(user.id);
	return json(players);
}
