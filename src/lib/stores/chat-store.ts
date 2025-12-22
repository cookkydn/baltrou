import { writable } from 'svelte/store';
import { events } from './event-store';

export interface ChatMessage {
	id: string;
	user: string;
	color: string | null;
	badges: Record<string, string> | null;
	message: string; // Utilise 'message' (comme dans votre code) et non 'text'
}

export interface ChatStoreState {
	messages: ChatMessage[];
	pinnedMessage: ChatMessage | null;
}

const LOCAL_STORAGE_KEY = 'baltrou_chat_history';
const defaultState: ChatStoreState = {
	messages: [],
	pinnedMessage: null
};

/**
 * Tente de récupérer l'état du store depuis le LocalStorage.
 * Gère les erreurs d'analyse JSON et l'environnement SSR.
 */
function getInitialState(): ChatStoreState {
	if (typeof window === 'undefined') {
		return defaultState;
	}

	try {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return parsed;
		}
	} catch (e) {
		console.error("Erreur lors du chargement de l'historique du chat:", e);
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	}

	return defaultState;
}

export const chat = writable<ChatStoreState>(getInitialState());

events.subscribe((event) => {
	if (event && event.type === 'irc_message') {
		const newMessage = event.data as ChatMessage;

		// 'store.update' met à jour la valeur du store
		chat.update((currentState) => {
			if (currentState.messages.find((msg) => newMessage.id == msg.id)) return currentState;
			const newMessages = [...currentState.messages, newMessage];
			const updatedMessages = newMessages.slice(-100); // Garde 100 max

			const newState = {
				messages: updatedMessages,
				pinnedMessage: currentState.pinnedMessage
			};

			if (typeof window !== 'undefined') {
				try {
					localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
				} catch (e) {
					console.error("Erreur lors de la sauvegarde de l'historique du chat:", e);
				}
			}

			return newState;
		});
	}
});
