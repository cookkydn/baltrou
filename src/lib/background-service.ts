// import { chat } from './stores/chat-store';
// import { stream, type StreamState } from './stores/stream-store';
// import type { ChatMessage } from './types/app';

// let listening = false;
// let chatListener: (() => void) | null = null;
// let streamListener: (() => void) | null = null;

// export function startListening() {
// 	if (listening) return;
// 	console.log('Started listening');
// 	listening = true;
// 	chatListener = startListeningChat();
// 	streamListener = startStreamListener();
// }

// export function stopListening() {
// 	if (!listening) return;
// 	console.log('Stopped listening');
// 	listening = false;
// 	chatListener?.();
// 	streamListener?.();
// }

// function startListeningChat() {
// 	const eventSource = new EventSource('/api/chat');
// 	eventSource.onmessage = (event) => {
// 		try {
// 			const message: ChatMessage = JSON.parse(event.data);
// 			chat.update((chatState) => {
// 				chatState.messages.push(message);
// 				return {
// 					...chatState,
// 					messageCount: chatState.messageCount + 1
// 				};
// 			});
// 		} catch (error) {
// 			console.error('Something went wrong:', error);
// 		}
// 	};

// 	eventSource.onerror = (error) => {
// 		console.error('Unable to connect to SSE:', error);
// 		eventSource.close();
// 	};
// 	return () => {
// 		eventSource.close();
// 	};
// }

// function startStreamListener() {
// 	console.log('Listening !');

// 	const eventSource = new EventSource('/api/stream');
// 	eventSource.onmessage = (event) => {
// 		try {
// 			const streamState: StreamState = JSON.parse(event.data);
// 			stream.set(streamState);
// 		} catch (error) {
// 			console.error('Something went wrong:', error);
// 		}
// 	};

// 	eventSource.onerror = (error) => {
// 		console.error('Unable to connect to SSE:', error);
// 		eventSource.close();
// 	};
// 	return () => {
// 		eventSource.close();
// 	};
// }
