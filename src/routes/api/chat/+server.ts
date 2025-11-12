import { initializeTwitchClient, sendChatMessage, subscribeToChatEvents } from '$lib/server/twitch/chat.js';
import type { ChatMessage } from '$lib/types/app';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	
	if (locals.credentials.twitch == null) {
		return new Response('Unauthorized', { status: 401 });
    }
	
	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	};
	const options = {
		identity: {
			username: locals.credentials.twitch.userLogin,
			password: `oauth:${locals.credentials.twitch.token}`
		},
		channels: [locals.credentials.twitch.userLogin]
	};
	await initializeTwitchClient(options);
	let unsubscribe = () => {};
	const stream = new ReadableStream({
		start(controller) {
			const sendEvent = (data: ChatMessage) => {
				const jsonData = JSON.stringify(data);
				const event = `data: ${jsonData}\n\n`;
				controller.enqueue(event);
			};
            sendEvent({user:"System",color:"#000000",message:"Connected to API"})

			unsubscribe = subscribeToChatEvents(sendEvent);
		},
		cancel() {
			unsubscribe();
		}
	});

	return new Response(stream, { headers });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (locals.credentials.twitch == null) {
        return new Response('Unauthorized', { status: 401 });
    }
    return json(await sendChatMessage(locals.credentials.twitch.token, locals.credentials.twitch.userId, (await request.json()).message));
}