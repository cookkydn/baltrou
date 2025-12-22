import type { App } from '$lib/state/app.svelte';
import { toasts } from '$lib/stores/toast-store';
import type { Player } from '$lib/types/activities/players';

export class PlayersModule {
	app: App;
	players: Player[] = $state([]);
	isLoaded = $state(false);

	constructor(app: App) {
		this.app = app;
		console.log('[PLAYERS] Loaded');
	}

	async load() {
		if (this.isLoaded) return;
		const res = await fetch('/api/activities/players');
		if (res.ok) {
			const players: Player[] = await res.json();
			this.players = players;
		} else {
			console.error(await res.text());
			toasts.add('Failed to fetch player list', 'error');
		}
		console.log(`[PLAYERS] Loaded ${this.players.length} players`);
		this.isLoaded = true;
	}

	async addPlayer(playerName: string) {
		const res = await fetch('/api/activities/players', {
			method: 'POST',
			body: JSON.stringify({ playerName })
		});
		if (res.ok) {
			const player = await res.json();
			this.players = [...this.players, player];
			this.removeDuplicates();
			console.log(`[PLAYERS] Added player ${playerName}`);
		} else {
			console.error(await res.text());
			toasts.add('Failed to create player', 'error');
		}
	}

	async removePlayer(playerId: string) {
		const res = await fetch(`/api/activities/players/${playerId}`, {
			method: 'DELETE'
		});
		if (res.ok) {
			this.players = this.players.filter((p) => p.id != playerId);
			console.log(`[PLAYERS] Removed player ${playerId}`);
		} else {
			console.error(await res.text());
			toasts.add('Failed to delete player', 'error');
		}
	}

	async setScore(playerId: string, score: number) {
		const player = this.players.find((p) => p.id == playerId);
		if (!player) {
			console.error(`[PLAYERS] player ${playerId} not found`);
			toasts.add('Failed to update score', 'error');
			return;
		}
		player.score = score;
		const res = await fetch(`/api/activities/players/${playerId}`, {
			method: 'PUT',
			body: JSON.stringify(player)
		});
		if (res.ok) {
			console.log(`[PLAYERS] ${player.name} score: ${score}`);
		} else {
			console.error(await res.text());
			toasts.add('Failed to update score', 'error');
		}
	}

	async uploadProfilePicture(playerId: string, file: File) {
		const form = new FormData();
		form.set('file', file);
		const res = await fetch(`/api/activities/players/${playerId}`, { method: 'POST', body: form });
		if (res.ok) {
			const player: Player = await res.json();
			this.players = this.players.map((p) =>
				p.id === playerId ? { ...p, profilePictureUrl: player.profilePictureUrl } : p
			);
			console.log(`[PLAYERS] Uploaded player profile picture ${file.name}`);
		} else {
			console.error(await res.text());
			toasts.add('Failed to upload profile picture', 'error');
		}
	}

	private removeDuplicates() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const ids = new Set();
		const uniquePlayers = this.players.filter(({ id }) => !ids.has(id) && ids.add(id));
		this.players = uniquePlayers;
	}
}
