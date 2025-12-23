<script lang="ts">
	import { asset } from '$app/paths';
	import { getApp } from '$lib/state/app.svelte';
	import { toasts } from '$lib/stores/toast-store';

	const { chatModule } = getApp();

	function sendDebugSound() {
		fetch('/api/events', {
			body: JSON.stringify({
				data: {
					url: asset('/debug-sound.mp3')
				},
				type: 'play_sound'
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});
	}

	function testToast() {
		toasts.add('Test info', 'info');
		toasts.add('Test success', 'success');
		toasts.add('Test warning', 'warning');
		toasts.add('Test error', 'error');
	}

	async function setFullscreen() {
		await document.body.requestFullscreen();
	}
</script>

<div class="debug-controls">
	<h4>Contrôles de Debug</h4>
	<button class="danger-btn" onclick={chatModule.clearMessages}>
		Vider l'historique du Chat
	</button>
	<button class="danger-btn" onclick={sendDebugSound}>Envoyer le son de débug</button>
	<button class="danger-btn" onclick={testToast}>Tester les toasts</button>
	<button class="danger-btn" onclick={setFullscreen}>Mettre en fullscreen</button>
</div>

<style>
	.debug-controls {
		font-family: 'Inter', sans-serif;
		color: white;
		padding: 1rem;
	}

	.debug-controls h4 {
		margin-top: 0;
		font-size: 1rem;
		font-weight: 700;
	}

	.danger-btn {
		background-color: #ef4444; /* Rouge */
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.danger-btn:hover {
		background-color: #dc2626; /* Rouge plus sombre */
	}
</style>
