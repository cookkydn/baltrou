import { env } from '$env/dynamic/private';
import type { TwitchUser } from '$lib/types';
import type { Credentials, User, ViewerRecord } from '$lib/types/user';
import { error } from '@sveltejs/kit';
import { db } from './db';

export const DEFAULT_USER: Omit<User, 'id' | 'credentials' | 'userLogin'> = {
	isInConfigMode: true,
	timerTargetDate: null,
	quickLinks: [
		{ id: crypto.randomUUID(), title: 'Twitch', url: 'https://twitch.tv', color: '#450e59' },
		{ id: crypto.randomUUID(), title: 'YouTube', url: 'https://youtube.com', color: '#831100' }
	],
	viewerHistory: [],
};

export async function getTwitchUserInfo(accessToken: string): Promise<TwitchUser | null> {
	const response = await fetch('https://api.twitch.tv/helix/users', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Client-ID': env.TWITCH_CLIENT_ID
		}
	});

	if (!response.ok) {
		console.error('Twitch API request failed:', await response.text());
		return null;
	}

	const data = await response.json();
	return data.data[0];
}

export async function addUser(user: User) {
	await db.read();
	db.data.users.push(user);
	await db.write();
	return user.id;
}

export async function getUser(userId: string): Promise<User | null> {
	await db.read();
	return db.data.users.find((usr) => usr.id == userId) || null;
}

export async function updateCredentials(user_id: string, credentials: Credentials) {
	await db.read();
	db.data.users.forEach((usr) => {
		if (usr.id != user_id) return;
		usr.credentials = credentials;
	});
	await db.write();
}

export async function getAllUsers() {
	await db.read();
	return db.data.users;
}


export async function addViewerRecord(userId: string, entry: ViewerRecord) {
	const FIVE_MIN_IN_MS = 1000 * 60 * 5;
	const MAX_AGE_MS = 1000 * 60 * 60 * 24 + FIVE_MIN_IN_MS; // 24 hours + 5 minutes
	await db.read();
	const user = db.data.users.find((u) => u.id == userId);
	if (!user) throw error(404, 'User not found');
	if (user.viewerHistory.length != 0) {
		const last = user.viewerHistory[user.viewerHistory.length - 1];
		if (entry.timestamp - last.timestamp < FIVE_MIN_IN_MS) return;
	}

	const cutoffTimestamp = entry.timestamp - MAX_AGE_MS;
	const freshHistory = user.viewerHistory.filter((record) => {
		return record.timestamp >= cutoffTimestamp;
	});
	freshHistory.push(entry);
	user.viewerHistory = freshHistory;
	await db.write();
}

export async function editUserInfo(user: Partial<User>&{id:string}) {
	await db.read();
	const userInDB = db.data.users.find(u=>u.id == user.id); 
	if(!userInDB) throw Error("No matching user found");
	Object.assign(userInDB, user);
	await db.write();
	return userInDB;
}