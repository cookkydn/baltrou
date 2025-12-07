import { writable } from 'svelte/store';
import type { QuickLink } from '$lib/types/user';
import { toasts } from './toast-store';

function createQuickLinksStore() {
	const { subscribe, update, set } = writable<QuickLink[]>([]);

	return {
		subscribe,
		set,
		add: (link: Omit<QuickLink, 'id'>) => {
			update((links) => {
				if (links.length >= 5) return links;
				const newLink = { ...link, id: crypto.randomUUID() };
				const newLinks = [...links, newLink];
				fetch('/api/user', {
					method: 'PATCH',
					body: JSON.stringify({ quickLinks: newLinks })
				}).catch((e) => {
					console.error(e);
					toasts.add(e, 'error');
				});
				return newLinks;
			});
		},
		remove: (id: string) => {
			update((links) => {
				const newLinks = links.filter((l) => l.id !== id);
				fetch('/api/user', {
					method: 'PATCH',
					body: JSON.stringify({ quickLinks: newLinks })
				}).catch((e) => {
					console.error(e);
					toasts.add(e, 'error');
				});
				return newLinks;
			});
		},
		edit: (id: string, data: Partial<QuickLink>) => {
			update((links) => {
				const newLinks = links.map((l) => (l.id === id ? { ...l, ...data } : l));
				fetch('/api/user', {
					method: 'PATCH',
					body: JSON.stringify({ quickLinks: newLinks })
				}).catch((e) => {
					console.error(e);
					toasts.add(e, 'error');
				});
				return newLinks;
			});
		}
	};
}

export const quickLinks = createQuickLinksStore();
