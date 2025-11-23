import { get, writable } from 'svelte/store';
import type { ObsClient } from './client';

export type Scene = {
  uuid: string,
  name: string,
};

export function createSceneModule(client: ObsClient) {
	const sceneList = writable<Scene[]>([]);
	const activeScene = writable<Scene | undefined>(undefined);

	async function switchScene(sceneName: string) {
		if (get(client.status) != 'CONNECTED') return;
		try {
			await client._client.call('SetCurrentProgramScene', { sceneName });
		} catch (err) {
			console.error(`[OBS] Erreur SetCurrentProgramScene:`, err);
		}
	}

  async function hydrate() {
		if (get(client.status) != 'CONNECTED') return;
    const { scenes } = await client._client.call('GetSceneList');
    sceneList.set(scenes.map((scene: any) => ({
      name: scene.sceneName,
      uuid: scene.sceneUuid,
    })))
  }

	return {
		sceneModule: {
			sceneList: {
				subscribe: sceneList.subscribe
			},
			activeScene: {
				subscribe: activeScene.subscribe,
				switchScene
			}
		},
    hydrateScenes:hydrate
	};
}
