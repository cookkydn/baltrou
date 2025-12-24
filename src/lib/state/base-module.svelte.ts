import { browser } from '$app/environment';
import { toasts } from '$lib/stores/toast-store';
import type { App } from './app.svelte';

export abstract class BaseModule {
	isLoaded = $state(false);
	app: App;
	constructor(app: App) {
		this.log(`Module initializing...`);
		this.app = app;
	}

	/**
	 * Load the module
	 */
	async load(force = false) {
		if (this.isLoaded && !force) return;
		if (!browser) return;

		try {
			await this.onLoad();
			this.isLoaded = true;
			this.log(`Module loaded`);
		} catch (e) {
			console.error(`[${this.constructor.name}] Error loading module:`, e);
			toasts.add(`Failed to load module ${this.constructor.name}`, 'error');
		}
	}

	log(message: string) {
		console.log(`[${this.constructor.name}]: ${message}`);
	}

	protected abstract onLoad(): Promise<void>;
}
