<script>
	import { pinnedMessage } from '$lib/stores';
	import CloseIcon from './icons/CloseIcon.svelte';

	function unpinMessage() {
		$pinnedMessage = null;
	}
</script>

{#if $pinnedMessage != null}
	<div class="pinned-message">
		<button class="close-button" onclick={unpinMessage}>
			<CloseIcon />
		</button>
		<h2>Message Épinglé</h2>
		<div class="message">
			<strong style="color: {$pinnedMessage.color}">{$pinnedMessage.user}:</strong>
			<span>{$pinnedMessage.message}</span>
		</div>
	</div>
{/if}

<style>
	.pinned-message {
		position: relative;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1rem;
	}
	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.pinned-message h2 {
		margin-top: 0;
		font-size: 1.2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}

	.pinned-message .message {
		font-family: 'Inter', sans-serif;
	}

	.pinned-message .message strong {
		margin-right: 0.5rem;
	}
</style>
