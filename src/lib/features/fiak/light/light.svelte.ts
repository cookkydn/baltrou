import type { App } from '$lib/state/app.svelte';
import { BaseModule } from '$lib/state/base-module.svelte';
import type { FiakModule } from '../fiak.svelte';

export class LightModule extends BaseModule {
	fiakModule: FiakModule;
	constructor(app: App, fiak: FiakModule) {
		super(app);
		this.fiakModule = fiak;
	}

	protected async onLoad(): Promise<void> {}
}
