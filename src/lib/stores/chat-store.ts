import type { ChatMessage } from '$lib/types/app';
import { writable } from 'svelte/store';

interface ChatState {
	messageCount: number;
	messages: ChatMessage[];
	pinnedMessage: ChatMessage | null;
}

export const chat = writable<ChatState>({
	messageCount: 0,
	messages: [],
	pinnedMessage: null
});
