import { writable, type Writable } from 'svelte/store';
import type { ChatMessage, TwitchUser } from './types';

export const chatStore: Writable<ChatMessage[]> = writable([]);
export const pinnedMessage: Writable<ChatMessage | null> = writable(null);
export const user: Writable<TwitchUser | null> = writable(null);
