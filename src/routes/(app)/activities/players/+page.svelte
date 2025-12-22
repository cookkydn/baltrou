<script lang="ts">
	import PlayerManager from '$lib/features/activities/players/PlayerManager.svelte';
	import PlayerRankings from '$lib/features/activities/players/PlayerRankings.svelte';
	import { getApp } from '$lib/state/app.svelte';
	import { onMount } from 'svelte';
	const {
		activities: { playersModule }
	} = getApp();
	onMount(() => {
		playersModule.load();
	});
</script>

<div class="flex">
	<PlayerManager
		bind:players={playersModule.players}
		addPlayer={(n) => playersModule.addPlayer(n)}
		onDelete={(id) => playersModule.removePlayer(id)}
		onUpdateScore={(id, score) => playersModule.setScore(id, score)}
		onUpdatePicture={(id, file) => playersModule.uploadProfilePicture(id, file)}
	/>
	<PlayerRankings players={playersModule.players} />
</div>

<style>
	.flex {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
