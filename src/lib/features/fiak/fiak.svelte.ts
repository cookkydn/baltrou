import type { App } from '$lib/state/app.svelte';
import { BaseModule } from '$lib/state/base-module.svelte';
import { toasts } from '$lib/stores/toast-store';
import type { ConnectionStatus } from '$lib/types/connection-status';
import { SvelteURL } from 'svelte/reactivity';

/**
 * Fiak is an internal api developped by Foustouille
 * it allow direct control of OBS assets and room lights,
 * it is custom tailored to fit our current need and may be removed in the future
 */
export class FiakModule extends BaseModule {
	baseUrl?: string = $state(undefined);
	connectionStatus: ConnectionStatus = $state('DISCONNECTED');
	constructor(app: App) {
		super(app);
	}

	private async ping(): Promise<boolean> {
		if (!this.baseUrl) return false;
		this.log(`Sending ping request to ${this.baseUrl}`);
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
			this.log('Ping request timed out');
			toasts.add('FIAK api not connected', 'error');
		}, 5000);
		const res = await fetch(this.getEndpoint('ping'), {
			signal: controller.signal,
			headers: { Accept: 'application/json' },
			method: 'GET'
		});
		clearTimeout(timeoutId);
		if (!res.ok) return false;
		const data = await res.json();
		if (!data.pong) return false;
		toasts.add('FIAK api connected', 'success');
		return true;
	}

	private getEndpoint(route: string) {
		if (!this.baseUrl) {
			throw new Error('Cannot give endpoint without baseURL');
		}
		const url = new SvelteURL(this.baseUrl, route);
		return url;
	}

	protected async onLoad() {}
}
