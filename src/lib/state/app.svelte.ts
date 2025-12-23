import { Activities } from '$lib/features/activities/activities.svelte';
import { ChatModule } from '$lib/features/chat/chat.svelte';
import { createContext } from 'svelte';

export class App {
	activities: Activities;
	chatModule: ChatModule;
	constructor() {
		console.log('[APP] Starting app...');
		this.activities = new Activities(this);
		this.chatModule = new ChatModule(this);
		console.log('[APP] Started');
	}
}

export const [getApp, initApp] = createContext<App>();
