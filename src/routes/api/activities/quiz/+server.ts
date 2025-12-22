import {
	addQuiz,
	extractQuizMetadata,
	getQuizzes,
	validateQuizSet
} from '$lib/server/activities/quiz';
import { getUserFromCookies } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export async function GET({ cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}
	return json(await getQuizzes(user.id));
}

export async function POST({ request, cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}

	let textContent;
	if (request.headers.get('Content-type')?.includes('multipart/form-data')) {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			throw error(400, 'Aucun fichier fourni');
		}
		textContent = await file.text();
	} else {
		const { url } = await request.json();
		const file = await fetch(url);
		textContent = await file.text();
	}

	let quizData;
	try {
		quizData = JSON.parse(textContent);
	} catch {
		throw error(400, "Le fichier n'est pas un JSON valide.");
	}

	const validation = validateQuizSet(quizData);
	if (!validation.isValid) {
		throw error(400, `Structure du Quiz invalide : ${validation.error}`);
	}
	const fileName = `${quizData.id}.json`;
	const uploadDir = 'data/quizzes';
	const filePath = path.join(uploadDir, fileName);

	await mkdir(uploadDir, { recursive: true });

	await writeFile(filePath, JSON.stringify(quizData, null, 2), 'utf-8');
	const metadata = extractQuizMetadata(quizData);
	await addQuiz(metadata, user.id);
	console.log(`[QUIZ] Nouveau quiz sauvegardé : ${fileName}`);

	return json(metadata);
}
