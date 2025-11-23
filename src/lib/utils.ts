import type { Writable } from "svelte/store";

/**
 * @param {import('svelte/store').Writable} store - Le store Svelte
 * @param {string|number} uuid - L'ID à chercher
 * @param {function} callback - La modification à apporter
 */
export const updateStoreItem = <T extends { uuid: string }>(store: Writable<T[]>, uuid: string, callback:(item:T)=>T) => {
    store.update(items => 
        items.map(item => item.uuid === uuid ? callback(item) : item)
    );
};