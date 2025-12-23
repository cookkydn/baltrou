<script lang="ts">
	import { getApp } from '$lib/state/app.svelte';
	import { toasts } from '$lib/stores/toast-store';

	const { chatModule } = getApp();

	let messageToSend = $state('');
	let chatContainer: HTMLElement;
	let isSending = $state(false);

	$effect(() => {
		chatModule.messages.length;
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	async function sendMessage(e?: Event) {
		e?.preventDefault();
		if (messageToSend.trim() === '' || isSending) return;

		const messageContent = messageToSend;
		isSending = true;

		try {
			await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: messageContent.trim() })
			});
			messageToSend = '';
		} catch (error) {
			console.error('Error sending message:', error);
			toasts.add('Failed to send chat message', 'error');
		} finally {
			isSending = false;
		}
	}
</script>

<div class="card chat-container">
	<h2>Chat</h2>
	<div class="chat-messages" bind:this={chatContainer}>
		{#each chatModule.messages as message (message.id)}
			<div class="message">
				<div class="message-content">
					<strong style="color: {message.color}">{message.user}:</strong>
					<span>{message.message}</span>
				</div>
			</div>
		{/each}
	</div>

	<form class="chat-input" onsubmit={sendMessage}>
		<input
			type="text"
			placeholder="Envoyer un message..."
			bind:value={messageToSend}
			disabled={isSending}
		/>
		<button type="submit" disabled={messageToSend.trim() === '' || isSending}>
			{isSending ? '...' : 'Envoyer'}
		</button>
	</form>
</div>

<style>
	.chat-container {
		padding: 1rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		height: 600px;
		max-width: 600px;
	}

	.chat-messages {
		flex-grow: 1;
		overflow-y: auto;
		margin-bottom: 1rem;
	}

	.message {
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem;
		border-radius: 4px;
		word-break: break-all;
	}

	.message:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.chat-input {
		display: flex;
	}

	.chat-input input {
		flex-grow: 1;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.5rem;
		border-radius: 4px 0 0 4px;
	}

	.chat-input button {
		background-color: #2196f3;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0 4px 4px 0;
		cursor: pointer;
	}
</style>
