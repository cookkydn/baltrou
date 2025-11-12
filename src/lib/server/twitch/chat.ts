import type { ChatMessage } from '$lib/types/app';
import tmi from 'tmi.js';
import { twitchFetch } from './fetch';
import type { TwitchChatResponse } from '$lib/types/twitch';

const sseClients = new Set<ChatSendFunction>();
export type ChatSendFunction = (data: ChatMessage) => void;
let tmiClient: tmi.Client | null = null;

export async function initializeTwitchClient(options: tmi.Options) {
	if (tmiClient) return; // Empêche la double initialisation

	tmiClient = new tmi.Client(options);
	tmiClient.on('message', (_, tags, message, self) => {
		console.log('New message:', message);

		if (self) return;
		const data: ChatMessage = {
			user: tags['display-name'] ?? 'unknown',
			message: message,
			color: tags.color ?? '#FFFFFF'
		};

		sseClients.forEach((send) => send(data));
	});
	await tmiClient.connect();
}

/**
 * Subscribes to chat events
 * @param sendFunction the function to be executed when a new chat is posted
 * @returns the unsusbscribe function
 */
export function subscribeToChatEvents(sendFunction: ChatSendFunction) {
	sseClients.add(sendFunction);
	return () => {
		sseClients.delete(sendFunction);
	};
}

export async function sendChatMessage(
	token: string,
	userId: string,
	message: string
): Promise<TwitchChatResponse> {
	if (!token || !userId || !message.trim()) {
		console.error('sendChatMessage: Missing token, user ID, or message content.');
		return { message_id: '', is_sent: false };
	}

	const response = await twitchFetch<TwitchChatResponse>('chat/messages', token, {
		method: 'POST',
		body: JSON.stringify({
			broadcaster_id: userId,
			sender_id: userId,
			message: message
		})
	});

	return response;
}
