<script lang="ts">
	import { onMount } from 'svelte';
	let time = $state(new Date());

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 100);
		return () => clearInterval(interval);
	});

	function formatTime(date: Date) {
		return date.toLocaleTimeString('fr-FR', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}
</script>

<div class="card no-margin">
	<div class="xl-label">HEURE</div>
	<div class="xl-text">
		{formatTime(time)}
	</div>
</div>

<style>
	.card {
		text-align: center;
		min-width: 300px;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
