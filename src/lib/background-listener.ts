import { chatStore } from './stores';
import type { ChatMessage } from './types';

let listening = false;

export function startListening() {
	if (listening) return;
	listening = true;
	startListeningChat();
}

export function startListeningChat() {
	const eventSource = new EventSource('/api/chat');
	eventSource.onmessage = (event) => {
		try {
			const message: ChatMessage = JSON.parse(event.data);
			chatStore.update((messages) => {
				if (messages.length >= 20) {
					messages.shift();
				}
				return [...messages, message];
			});
		} catch (error) {
			console.error('Something went wrong:', error);
		}
	};

	eventSource.onerror = (error) => {
		console.error('Unable to connect to SSE:', error);
		eventSource.close();
	};
	return () => {
		eventSource.close();
	};
}
