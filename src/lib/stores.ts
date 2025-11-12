import { writable, type Writable } from 'svelte/store';
import type { ChatMessage, TwitchUser } from './types';

/** @deprecated */
export const chatStore: Writable<ChatMessage[]> = writable([]);
/** @deprecated */
export const pinnedMessage: Writable<ChatMessage | null> = writable(null);
/** @deprecated */
export const user: Writable<TwitchUser | null> = writable(null);
