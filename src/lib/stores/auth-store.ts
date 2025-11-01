import { writable } from 'svelte/store';

interface AuthState {
	loggedIn: boolean;
}

export const auth = writable<AuthState>({
	loggedIn: false
});
