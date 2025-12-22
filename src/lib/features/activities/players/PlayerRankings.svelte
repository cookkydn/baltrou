<script lang="ts">
	import { flip } from 'svelte/animate';
	import { quadOut } from 'svelte/easing';
	import { Trophy, Medal, User } from '@lucide/svelte';
	import type { Player } from '$lib/types/activities/players';

	interface Props {
		players: Player[];
	}

	let { players }: Props = $props();

	let sortedPlayers = $derived([...players].sort((a, b) => b.score - a.score));

	function getRankIcon(index: number) {
		if (index === 0) return { component: Trophy, color: '#ffd700' }; // Or
		if (index === 1) return { component: Medal, color: '#c0c0c0' }; // Argent
		if (index === 2) return { component: Medal, color: '#cd7f32' }; // Bronze
		return null;
	}
</script>

<div class="card rankings-card">
	<h2 class="rankings-title">Classement</h2>

	<div class="rankings-list">
		{#each sortedPlayers as player, i (player.id)}
			{@const rank = getRankIcon(i)}
			<div
				animate:flip={{ duration: 600, easing: quadOut }}
				class="player-row"
				class:top-three={i < 3}
			>
				<div class="rank-number">
					{#if rank}
						<rank.component size={20} color={rank.color} />
					{:else}
						<span class="index">{i + 1}</span>
					{/if}
				</div>

				<div class="player-main">
					{#if player.profilePictureUrl}
						<img src={player.profilePictureUrl} alt="" class="mini-avatar" />
					{:else}
						<div class="mini-avatar placeholder">
							<User size={14} />
						</div>
					{/if}
					<span class="player-name">{player.name}</span>
				</div>

				<div class="player-score">
					<span class="score-val">{player.score}</span>
					<span class="score-unit">pts</span>
				</div>
			</div>
		{:else}
			<p class="empty-msg">Aucun joueur enregistré</p>
		{/each}
	</div>
</div>

<style>
	.rankings-card {
		padding: 1.5rem;
		max-width: 500px;
		flex-grow: 2;
		height: 100%;
	}

	.rankings-title {
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 1.8rem;
	}

	.rankings-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.player-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-md);
		border: 1px solid var(--surface-border);
		transition: transform 0.2s ease;
	}

	.player-row.top-three {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.rank-number {
		width: 30px;
		display: flex;
		justify-content: center;
		font-weight: bold;
		color: var(--text-secondary);
	}

	.player-main {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-grow: 1;
	}

	.mini-avatar {
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		object-fit: cover;
		background: var(--menu-bg);
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--surface-border);
	}

	.player-name {
		font-weight: 500;
		font-size: 1.1rem;
	}

	.player-score {
		display: flex;
		align-items: baseline;
		gap: 0.2rem;
	}

	.score-val {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		color: var(--accent-info);
	}

	.score-unit {
		font-size: 0.7rem;
		text-transform: uppercase;
		opacity: 0.6;
	}

	.empty-msg {
		text-align: center;
		color: var(--text-muted);
		padding: 1rem;
	}
</style>
