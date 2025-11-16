<script lang="ts">
	import { onMount } from 'svelte';
	import {
		obsConnectionStatus,
		loadObsSettings,
		saveObsSettings,
		connectObs,
		disconnectObs
	} from '$lib/stores/obs-store';
  
	// État local du formulaire
	let host = 'localhost';
	let port = 4455;
	let password = '';

	onMount(() => {
		// Charger les paramètres sauvegardés au montage
		const settings = loadObsSettings();
		if (settings) {
			host = settings.host;
			port = settings.port;
			password = settings.password || '';
		}
	});

	async function connect() {
		saveObsSettings({ host, port, password });
		await connectObs();
	}

	function disconnect() {
		saveObsSettings({ host: '', port: 4455, password: '' });
		disconnectObs();
	}

	// Classe CSS réactive pour le statut
	$: statusClass = {
		DISCONNECTED: 'status-disconnected',
		CONNECTING: 'status-connecting',
		CONNECTED: 'status-connected',
		ERROR: 'status-error'
	}[$obsConnectionStatus];
</script>

<div class="obs-settings-container">
	<h2>Connexion OBS WebSocket</h2>

	<div class="status-box">
		Statut: <span class="status-text {statusClass}">{$obsConnectionStatus}</span>
	</div>

	<div class="form-group">
		<label for="obs-host">Hôte (Host)</label>
		<input id="obs-host" type="text" bind:value={host} placeholder="localhost" />
	</div>

	<div class="form-group">
		<label for="obs-port">Port</label>
		<input id="obs-port" type="number" bind:value={port} placeholder="4455" />
	</div>

	<div class="form-group">
		<label for="obs-password">Mot de passe</label>
		<input id="obs-password" type="password" bind:value={password} placeholder="requis si activé" />
	</div>

	<div class="button-group">
		{#if $obsConnectionStatus === 'CONNECTED'}
			<button class="disconnect-btn" on:click={disconnect}>Déconnecter</button>
		{:else}
			<button
				class="connect-btn"
				on:click={connect}
				disabled={$obsConnectionStatus === 'CONNECTING'}
			>
				{$obsConnectionStatus === 'CONNECTING' ? 'Connexion...' : 'Connecter'}
			</button>
		{/if}
	</div>
</div>

<style>
	.obs-settings-container {
		/* Style global (blanc transparent) */
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 2rem;
		margin: 2rem auto;
		max-width: 42rem;
		font-family: 'Inter', sans-serif;
		color: white;
	}

	h2 {
		font-family: 'Bebas Neue', cursive;
		font-size: 2rem;
		margin-top: 0;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.form-group input {
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		box-sizing: border-box; /* Important pour le padding */
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.button-group button {
		border: none;
		padding: 0.75rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 700;
	}

	.save-btn {
		background-color: #2196f3; /* Bleu */
		color: white;
	}
	.connect-btn {
		background-color: #22c55e; /* Vert */
		color: white;
	}
	.connect-btn:disabled {
		opacity: 0.5;
	}
	.disconnect-btn {
		background-color: #ef4444; /* Rouge */
		color: white;
	}

	.status-box {
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}
	.status-text {
		font-weight: 700;
	}
	.status-connecting {
		color: #eab308;
	}
	.status-connected {
		color: #22c55e;
	}
	.status-error {
		color: #ef4444;
	}
	.status-disconnected {
		color: #9ca3af;
	}

	.scenes-debug {
		margin-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		padding-top: 1rem;
	}
</style>
