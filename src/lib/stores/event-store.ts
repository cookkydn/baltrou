import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import type { SseEvent } from '$lib/types/events';

export const events = readable<SseEvent | null>(null, (set) => {
  if (!browser) return;

  const eventSource = new EventSource('/api/events');

  const updateStore = (rawData: {type:string} & any) => {
    set({
      type: rawData.type,
      data: rawData.data,
      timestamp: new Date()
    });
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateStore(data); 
    } catch {
      console.error('SSE: Failed to parse message', event.data);
    }
  };

  eventSource.addEventListener('connected', (event) => {
    try {
      const data = JSON.parse(event.data);
      updateStore({type: 'connected', data});
    } catch {
      console.error('SSE: Failed to parse connected event', event.data);
    }
  });

  eventSource.onerror = () => {
    console.error('SSE: Connection lost');
    updateStore({ message: 'Connection lost', type: 'error' });
    eventSource.close(); 
  };

  return () => {
    console.log('SSE: No more subscribers, closing connection.');
    eventSource.close();
  };
});