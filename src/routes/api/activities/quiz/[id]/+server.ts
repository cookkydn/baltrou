import { getUserFromCookies } from '$lib/server/auth';
import { error } from 'console';
import { readFile } from 'fs/promises';

export async function GET({ cookies, route }) {
	const user = await getUserFromCookies(cookies);
	if (!user) {
		throw error(401, 'Non autorisé');
	}

  const quizId = route.id;
  const file = await readFile(`/data/quizzes/${quizId}`)
  const json = JSON.parse(file.toString());
  return json(json)
}
