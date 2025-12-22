import { error } from '@sveltejs/kit';
import { db } from '../db';
import { getUser } from '../user';
import { mkdir, writeFile } from 'fs/promises';
import { env } from '$env/dynamic/private';
import type { Player } from '$lib/types/activities/players';

export async function addPlayer(userId: string, playerName: string) {
	await db.read();
	const user = db.data.users.find((u) => u.id === userId);
	if (!user) {
		throw error(404, 'User not found');
	}
	const existingPlayer = user.activities.players.find((p) => p.name == playerName);
	if (existingPlayer) {
		return existingPlayer;
	}
	const player: Player = {
		name: playerName,
		id: crypto.randomUUID(),
		score: 0
	};
	if (Array.isArray(user.activities.players)) {
		user.activities.players.push(player);
	} else {
		user.activities.players = [player];
	}
	await db.write();
	return player;
}

export async function setScore(userId: string, playerId: string, score: number) {
	await db.read();
	const user = db.data.users.find((u) => u.id === userId);
	if (!user) {
		throw error(404, 'User not found');
	}
	const player = user.activities.players.find((p) => p.id == playerId);
	if (!player) {
		throw error(404, 'Player not found');
	}
	player.score = score;
	await db.write();
}

export async function removePlayer(userId: string, playerId: string) {
	await db.read();
	const user = db.data.users.find((u) => u.id === userId);
	if (!user) {
		throw error(404, 'User not found');
	}
	await db.read();
	user.activities.players = user.activities.players.filter((p) => p.id != playerId);
	await db.write();
}

export async function setPlayerProfilePicture(userId: string, playerId: string, file: File) {
	const basePath = 'data/profiles';
	await mkdir(basePath, { recursive: true });
	const fileExtension = file.name.split('.').pop() || '.png';
	const fileData = new Uint8Array(await file.arrayBuffer());
	await writeFile(`${basePath}/${playerId}.${fileExtension}`, fileData);
	await db.read();
	const user = db.data.users.find((u) => u.id === userId);
	if (!user) {
		throw error(404, 'User not found');
	}
	const player = user.activities.players.find((p) => p.id == playerId);
	if (!player) {
		throw error(404, 'Player not found');
	}
	player.profilePictureUrl =
		env.ORIGIN + `/api/activities/players/${playerId}?extension=${fileExtension}`;
	await db.write();
	return player;
}

export async function getPlayers(userId: string) {
	const user = await getUser(userId);
	if (!user) {
		throw error(404, 'User not found');
	}
	await db.read();
	return user.activities.players || [];
}
