import { error, json } from '@sveltejs/kit';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { getUserFromCookies } from '$lib/server/auth';
import path from 'path';
import eventBus from '$lib/server/event-bus.js';

const FILE_PATH = path.resolve('data/live-quiz.json');

export async function GET() {
	try {
		const data = await readFile(FILE_PATH, 'utf-8');
		return json(JSON.parse(data), {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});
	} catch (err) {
		console.error('[LIVE-QUIZ] Erreur lecture :', err);
		throw error(404, 'Aucun quiz live trouvé');
	}
}

export async function POST({ request, cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}

	try {
		const quizData = await request.json();

		await mkdir(path.dirname(FILE_PATH), { recursive: true });

		await writeFile(FILE_PATH, JSON.stringify(quizData, null, 2), 'utf-8');

		console.log(`[LIVE-QUIZ] Données mises à jour par ${user.userLogin}`);
		eventBus.emit(`event:${user.id}`, { type: 'quiz_update' });
		return json({ success: true, message: 'Quiz live mis à jour' });
	} catch (err) {
		console.error('[LIVE-QUIZ] Erreur écriture :', err);
		throw error(400, "Format JSON invalide ou erreur d'écriture");
	}
}
