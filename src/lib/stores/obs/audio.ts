import { get, writable } from 'svelte/store';
import type { ObsClient } from './client';
import { updateStoreItem } from '$lib/utils';

export type AudioSource = {
	uuid: string;
	name: string;
	volume: number;
	muted: boolean;
	active: boolean;
};

export function createAudioModule(client: ObsClient) {
	const audioSources = writable<AudioSource[]>([]);
	async function toggleMute(uuid: string) {
		if (get(client.status) != 'CONNECTED') return;
		try {
			const { inputMuted } = await client._client.call('ToggleInputMute', { inputUuid: uuid });
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, muted: inputMuted }));
		} catch (err) {
			console.error(`[OBS] Erreur ToggleInputMute:`, err);
		}
	}

	async function setVolume(uuid: string, volume: number) {
		if (get(client.status) != 'CONNECTED') return;
		try {
			const db = volume - 100;
			await client._client.call('SetInputVolume', { inputUuid: uuid, inputVolumeDb: db });
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, volume }));
		} catch (err) {
			console.error(`[OBS] Erreur SetInputVolume:`, err);
		}
	}

  async function setActive(uuid: string, active: boolean) {
		if (get(client.status) != 'CONNECTED') return;
		try {
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, active }));
		} catch (err) {
			console.error(`[OBS] Erreur SetInputVolume:`, err);
		}
	}

	return {
		audioSources: {
			subscribe: audioSources.subscribe,
			toggleMute,
			setVolume,
      setActive,
		}
	};
}
