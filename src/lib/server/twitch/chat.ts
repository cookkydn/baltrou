import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import type { ChatMessage, TwitchCredentials } from '$lib/types';
import tmi from 'tmi.js';

const sseClients = new Set<ChatSendFunction>();
export type ChatSendFunction = (data: ChatMessage) => void;
let tmiClient: tmi.Client | null = null;

export async function initializeTwitchClient(options: tmi.Options) {
    if (tmiClient) return; // Empêche la double initialisation

    tmiClient = new tmi.Client(options);
    tmiClient.on('message', (_, tags, message, self) => {
        if (self) return;
        const data: ChatMessage = {
            id: tags.id ?? crypto.randomUUID(),
            user: tags['display-name'] ?? 'unknown',
            message: message, 
            color: tags.color ?? '#FFFFFF'
        };
        
        sseClients.forEach(send => send(data));
    });
    await tmiClient.connect();
}

/**
 * Subscribes to chat events
 * @param sendFunction the function to be executed when a new chat is posted
 * @returns the unsusbscribe function
 */
export function subscribeToChatEvents(sendFunction:ChatSendFunction) {
    sseClients.add(sendFunction);
    return () => {
        sseClients.delete(sendFunction); // Fonction de désabonnement pour le cleanup
    };
}

export async function sendChatMessage(credentials: TwitchCredentials, message: string): Promise<TwitchChatResponse> {
    const TWITCH_CHAT_API_URL = 'https://api.twitch.tv/helix/chat/messages';

    if (!credentials.token || !credentials.userId || !message.trim()) {
        console.error("sendChatMessage: Missing token, user ID, or message content.");
        return { message_id: "", is_sent: false };
    }

    const response = await fetch(TWITCH_CHAT_API_URL, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${credentials.token}`,
            'Client-ID': PUBLIC_TWITCH_CLIENT_ID,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            broadcaster_id: credentials.userId, 
            sender_id: credentials.userId, 
            message: message,
        })
    });

    if (!response.ok) {
        // 3. Gestion des erreurs détaillées
        const errorText = await response.text();
        console.error(`Twitch API request failed (${response.status}):`, errorText);
        
        
        const errorData = JSON.parse(errorText);
        console.error('Twitch Error details:', errorData);
        
        return { message_id: "", is_sent: false };
    }


    const data = await response.json();

    if (data && data.data && data.data[0]) {
        return data.data[0] as TwitchChatResponse;
    }

    console.warn("Twitch API returned success, but unexpected data structure.", data);
    return { message_id: 'unknown', is_sent: true };
}

export interface TwitchChatResponse {
    message_id: string;
    is_sent: boolean;
} 