import { getUserFromCookies } from '$lib/server/auth.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const user = await getUserFromCookies(cookies);
	if (!user) return error(401, 'You must be connected');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userData = (({ viewerHistory: viewer_history, ...u }) => u)(user);
	return json(userData);
}
