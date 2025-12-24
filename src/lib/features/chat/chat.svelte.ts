import { browser } from '$app/environment';
import type { App } from '$lib/state/app.svelte';
import { BaseModule } from '$lib/state/base-module.svelte';
import { events } from '$lib/stores/event-store';
import { toasts } from '$lib/stores/toast-store';
import type { ChatMessage } from '$lib/types/chat';

const LOCAL_STORAGE_KEY = 'baltrou_chat_history';

export class ChatModule extends BaseModule {
	protected async onLoad() {
		this.loadFromLocalStorage();
		this.listenToMessageEvents();
	}
	messages = $state<ChatMessage[]>([]);
	isLoaded = $state(false);

	constructor(app: App) {
		super(app);
		if (browser) {
			this.load();
		}
	}

	private loadFromLocalStorage() {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!stored) {
			this.log('nothing found in localstorage');
			return;
		}
		try {
			this.messages = JSON.parse(stored);
		} catch (e) {
			console.error('Erreur lecture chat history', e);
			toasts.add('Failed to retreive chat history', 'error');
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
			return;
		}
		this.log(`Loaded ${this.messages.length} messages`);
	}

	private listenToMessageEvents() {
		events.subscribe((event) => {
			if (event && event.type === 'irc_message') {
				this.addMessage(event.data as ChatMessage);
			}
		});
	}

	private saveToStorage() {
		if (typeof window === 'undefined') return;
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.messages));
	}

	addMessage(msg: ChatMessage) {
		if (this.messages.find((m) => m.id === msg.id)) return;

		this.messages = [...this.messages, msg].slice(-100);
		this.saveToStorage();
	}

	clearMessages() {
		this.messages = [];
		this.saveToStorage();
		toasts.add('Chat cleared !', 'success');
	}
}
