// import { getStreamState } from '$lib/server/twitch/stream.js';
// import type { StreamState } from '$lib/stores/stream-store.js';

// export async function GET({ locals }) {
// 	console.log('Started listener');

// 	if (locals.credentials.twitch == null) {
// 		return new Response('Unauthorized', { status: 401 });
// 	}
// 	const headers = {
// 		'Content-Type': 'text/event-stream',
// 		'Cache-Control': 'no-cache',
// 		Connection: 'keep-alive'
// 	};
// 	const twitch = locals.credentials.twitch;
// 	let intervalId: NodeJS.Timeout | null = null;
// 	const stream = new ReadableStream({
// 		start(controller) {
// 			const request = async () => {
// 				const res = (await getStreamState(twitch.token, twitch.userLogin)).data;
// 				console.log(res);
// 				let data: StreamState;
// 				if(res.length == 0) {
// 					data = {
// 						isLive: false,
// 						title: "",
// 						viewer_count: 0
// 					}
// 				} else {
// 					data = {
// 						isLive: true,
// 						title: res[0].title,
// 						viewer_count: res[0].viewer_count,
// 					}
// 				}
// 				const jsonData = JSON.stringify(data);
// 				const event = `data: ${jsonData}\n\n`;
// 				controller.enqueue(event);
// 			};
// 			request();
// 			intervalId = setInterval(request, 5 * 60 * 1000);
// 		},
// 		cancel() {
// 			if(intervalId) {
// 				clearInterval(intervalId);
// 			}
// 		}
// 	});

// 	return new Response(stream, { headers });
// }
