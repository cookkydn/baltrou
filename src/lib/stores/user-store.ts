import { writable } from 'svelte/store';
import { toasts } from './toast-store';

export const auth = writable<boolean>(false);




function createAppModeStore() {

	const { subscribe, set } = writable<'CONFIG' | 'STREAM'>('STREAM');
	return {
		subscribe,
		set: (mode: 'CONFIG' | 'STREAM') => {
			set(mode);
			fetch('/api/user', {method: "PATCH",body: JSON.stringify({isInConfigMode: mode == 'CONFIG'})}).catch(e=>{
				console.error(e);
				toasts.add(e,'error');
			})
			return mode;
		}
	};
}

function createTimerStore() {
	const { subscribe, set } = writable<Date | null>(null);

	return {
		subscribe,

		remove: () => {
			set(null);
			fetch('/api/user', {method: "PATCH",body: JSON.stringify({timerTargetDate: null})}).catch(e=>{
				console.error(e);
				toasts.add(e,'error');
			})
		},
		set: (date: Date) => {
			set(date);
			fetch('/api/user', {method: "PATCH",body: JSON.stringify({timerTargetDate: date})}).catch(e=>{
				console.error(e);
				toasts.add(e,'error');
			})
			return date;
		}
	};
}

export const timer = createTimerStore();
export const appMode = createAppModeStore();
