import { createAudioModule } from './audio';
import { createObsClient } from './client';
import { createSceneModule } from './scene';

const client = createObsClient();
const { sceneModule, hydrateScenes: hydrateScenes } = createSceneModule(client);

async function init() {
  await client.connect();
  await hydrateScenes();
}

export const obs = {
	client,
	...sceneModule,
	...createAudioModule(client),
  init,
};
