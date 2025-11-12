import { writable } from "svelte/store";

export interface StreamState {
    title: string,
    isLive: boolean,
    viewer_count: number,
}

export const stream = writable<StreamState>({
    isLive: false,
    title: "",
    viewer_count: 0,
})