<script>
	import LiveStatus from "$lib/components/LiveStatus.svelte";
    import { chat } from "$lib/stores/chat-store";
    import { stream } from "$lib/stores/stream-store";
</script>
<h1>Statistiques du Stream</h1>

<div class="stats-grid">
	<div class="stat-card">
		<h2>Status du Stream</h2>
		<LiveStatus />
	</div>

	<div class="stat-card">
		<h2>Viewers</h2>
		<p>{$stream.viewer_count}</p>
	</div>

	<div class="stat-card">
		<h2>Commentaires</h2>
		<p>{$chat.messageCount}</p>
	</div>

	<div class="stat-card">
		<h2>Followers</h2>
		<p>N/A</p>
	</div>

	<div class="stat-card">
		<h2>Abonnés</h2>
		<p>N/A</p>
	</div>

	<div class="stat-card full-width">
		<h2>Viewers au cours du temps</h2>
		<!-- Le graphique sera inséré ici -->
		<div class="chart-placeholder">Graphique à venir</div>
	</div>
</div>


<style>
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.stat-card {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1rem;
		text-align: center;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
    .stat-card p {
        margin: 0;
    }

	.full-width {
		grid-column: 1 / -1;
	}

	.chart-placeholder {
		width: 100%;
		height: 300px;
		background-color: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		margin-top: 1rem;
	}
</style>
