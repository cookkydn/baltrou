import { initializeTwitchClient, sendChatMessage, subscribeToChatEvents } from '$lib/server/twitch/chat.js';
import { getTwitchUserInfo } from '$lib/server/twitch/user.js';
import type { ChatMessage } from '$lib/types.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
    if (locals.twitchCredentials == null) {
        console.log('Unauthorized');
        return new Response('Unauthorized', { status: 401 });
    }
	if(locals.twitchUser == null) {
        const user = await getTwitchUserInfo(locals.twitchCredentials.token);
        if(!user) {
            console.error("Unable to fetch user info");
            throw new Error("Unable to fetch user info");
        } else {
            locals.twitchUser = user;
        }
    }

	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	};
	const options = {
		identity: {
			username: locals.twitchUser.login,
			password: `oauth:${locals.twitchCredentials.token}`
		},
		channels: [locals.twitchUser.login]
	};
	await initializeTwitchClient(options);
	let unsubscribe = () => {};
	const stream = new ReadableStream({
		start(controller) {
			// 2. Fonction d'envoi SSE
			const sendEvent = (data: ChatMessage) => {
				const jsonData = JSON.stringify(data);
				const event = `data: ${jsonData}\n\n`;
				controller.enqueue(event);
			};
            sendEvent({id:"",user:"System",color:"#000000",message:"Connected to API"})

			// 3. Abonnez-vous au service persistant
			unsubscribe = subscribeToChatEvents(sendEvent);
		},
		cancel() {
			// 4. Se désabonner du service lorsque la connexion est coupée
			unsubscribe();
		}
	});

	return new Response(stream, { headers });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
    if (locals.twitchCredentials == null) {
        return new Response('Unauthorized', { status: 401 });
    }
    return json(await sendChatMessage(locals.twitchCredentials,(await request.json()).message));
}