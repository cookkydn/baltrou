<script lang="ts">
	import type { Player } from '$lib/types/activities/players';
	import { Plus } from '@lucide/svelte';
	import PlayerCard from './PlayerCard.svelte';
	import { noop } from 'chart.js/helpers';

	let {
		players = $bindable([]),
		addPlayer = noop,
		onDelete = noop,
		onUpdateScore = noop,
		onUpdatePicture = noop
	}: {
		players: Player[];
		addPlayer: (playerName: string) => void;
		onDelete: (id: string) => void;
		onUpdateScore: (id: string, score: number) => void;
		onUpdatePicture: (id: string, file: File) => void;
	} = $props();

	let newPlayerName = $state('');
	function onNewPlayer() {
		if (newPlayerName.trim() == '') return;
		addPlayer(newPlayerName.trim());
		newPlayerName = '';
	}
</script>

<div class="card player-manager-container">
	<h2 class="xl-label">Gestion des Joueurs</h2>

	<div class="add-section">
		<div class="form-group no-margin">
			<input
				type="text"
				placeholder="Nom du joueur..."
				bind:value={newPlayerName}
				onkeydown={(e) => e.key === 'Enter' && onNewPlayer()}
			/>
		</div>
		<button class="btn btn-primary" onclick={onNewPlayer} disabled={!newPlayerName}>
			<Plus size={18} />
		</button>
	</div>

	<div class="player-list">
		{#each players as player (player.id)}
			<PlayerCard {player} {onDelete} {onUpdateScore} {onUpdatePicture}></PlayerCard>
		{:else}
			<p class="empty-text">Aucun joueur configuré.</p>
		{/each}
	</div>
</div>

<style>
	.player-manager-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 500px;
		flex-grow: 2;
	}

	.add-section {
		display: flex;
		gap: 0.5rem;
	}

	.no-margin {
		margin-bottom: 0 !important;
		flex: 1;
	}

	.player-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-text {
		text-align: center;
		color: var(--text-muted);
		font-style: italic;
	}
</style>
