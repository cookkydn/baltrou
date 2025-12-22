import { deleteQuiz } from '$lib/server/activities/quiz.js';
import { getUserFromCookies } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { error } from 'console';
import { readFile } from 'fs/promises';

export async function GET({ cookies, params }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}

  const quizId = params.id;
  const file = await readFile(`data/quizzes/${quizId}.json`)
  const jsonContent = JSON.parse(file.toString());
  return json(jsonContent)
}

export async function DELETE({cookies, params}) {
  const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}

  const quizId = params.id;
  await deleteQuiz(quizId,user.id);
  return json({});
}