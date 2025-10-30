// See https://svelte.dev/docs/kit/types#app.d.ts

import type { TwitchCredentials, TwitchUser } from "$lib/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			twitchCredentials: TwitchCredentials | null;
			twitchUser : TwitchUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
