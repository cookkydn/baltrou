import { PUBLIC_TWITCH_CLIENT_ID } from "$env/static/public";
import type { TwitchUser } from "$lib/types";

export async function getTwitchUserInfo(accessToken: string): Promise<TwitchUser|null> {
    const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': PUBLIC_TWITCH_CLIENT_ID
        }
    });

    if (!response.ok) {
        console.error('Twitch API request failed:', await response.text());
        return null;
    }

    const data = await response.json();
    return data.data[0];
}

// export async function getStreamStatus(accessToken: string, channelLogin: string) {
//     if (!accessToken || !channelLogin) return null;

//     const url = new URL('https://api.twitch.tv/helix/streams');
//     url.searchParams.set('user_login', channelLogin);

//     const response = await fetch(url, {
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Client-ID': PUBLIC_TWITCH_CLIENT_ID
//         }
//     });

//     if (!response.ok) {
//         console.error('Twitch API request for stream status failed:', await response.text());
//         return null;
//     }

//     const data = await response.json();
//     return data.data[0] || null; // Return the stream object or null if offline
// }