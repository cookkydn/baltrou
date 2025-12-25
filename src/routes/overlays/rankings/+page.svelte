<script>
	import PlayerRankings from '$lib/features/activities/players/PlayerRankings.svelte';
	import { getApp } from '$lib/state/app.svelte';
	import { events } from '$lib/stores/event-store';
	import { onMount } from 'svelte';
	const {
		activities: { playersModule }
	} = getApp();

	onMount(() => {
		playersModule.load();
		events.subscribe((e) => {
			if (e?.type == 'player_score_update') {
				const playerToUpdate = playersModule.players.find((p) => p.id == e.data.id);
				if (playerToUpdate) {
					playerToUpdate.score = e.data.score;
				}
			}
		});
	});
</script>

<div class="overlay-viewport">
	<div class="ratio-box">
		<PlayerRankings players={playersModule.players} />
	</div>
</div>

<style>
	.overlay-viewport {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
	}

	.ratio-box {
		box-sizing: border-box;
		width: 100%;

		display: flex;
		flex-direction: column;
		position: relative;
	}
</style>
