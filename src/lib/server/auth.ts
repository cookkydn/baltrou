import type { User } from '$lib/types/user';
import type { Cookies } from '@sveltejs/kit';
import { db } from './db';

export async function getUserFromCookies(cookies: Cookies): Promise<User | null> {
	const userId = cookies.get('user_id');
	if (!userId) return null;
	await db.read();
	const user = db.data.users.find((u) => u.id == userId);
	if (user == undefined) {
		cookies.set('user_id', '', {
			expires: new Date(),
			path: '/'
		});
	}
	return user || null;
}
