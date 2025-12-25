import { removePlayer, setPlayerProfilePicture, setScore } from '$lib/server/activities/players';
import { getUserFromCookies } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime/lite';
import eventBus from '$lib/server/event-bus.js';
export async function PUT({ cookies, request, params }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	const { score } = await request.json();
	setScore(user.id, params.id, score);
	eventBus.emit(`event:${user.id}`, {
		type: 'player_score_update',
		data: { id: params.id, score }
	});
	return json({ score });
}

export async function DELETE({ cookies, params }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	removePlayer(user.id, params.id);
	return new Response(null, { status: 204 });
}

export async function POST({ cookies, request, params }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	if (!request.headers.get('Content-type')?.includes('multipart/form-data')) {
		throw error(400, 'Invalid content type');
	}
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		throw error(400, 'Aucun fichier fourni');
	}
	const player = await setPlayerProfilePicture(user.id, params.id, file);
	return json(player);
}

export async function GET({ params, url }) {
	const extension = url.searchParams.get('extension');
	try {
		const filePath = path.resolve('data/profiles/', params.id + '.' + extension);
		const data = await readFile(filePath);
		const contentType = mime.getType(filePath) || 'image/png';
		const headers = new Headers();
		headers.set('Content-Type', contentType);
		return new Response(data, { headers });
	} catch (err) {
		throw error(404, 'Error:' + err);
	}
}
