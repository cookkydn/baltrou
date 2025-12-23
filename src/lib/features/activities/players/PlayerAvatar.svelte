<script lang="ts">
	import type { Player } from '$lib/types/activities/players';
	import { User } from '@lucide/svelte';

	interface Props {
		player: Player;
	}

	let { player }: Props = $props();
</script>

<div class="avatar-wrapper">
	{#if player?.profilePictureUrl}
		<img src={player.profilePictureUrl} alt="player profile" />
	{:else}
		<div class="placeholder">
			<User size={20} />
		</div>
	{/if}
</div>

<style>
	.avatar-wrapper {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		background: var(--menu-bg);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		height: 100%;
	}
</style>
