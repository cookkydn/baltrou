// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Credentials } from "$lib/types/app";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			credentials: Credentials;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
