// src/routes/api/user/+server.ts (Exemple de chemin)
import { getTwitchUserInfo } from '$lib/server/twitch/user.js';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.twitchCredentials) {
        return json({ message: "Missing Twitch credentials (token). Please log in." }, { status: 401 });
    }

    if (locals.twitchUser) {
        return json(locals.twitchUser);
    }

    const user = await getTwitchUserInfo(locals.twitchCredentials.token);

    if (!user) {
        return json({ message: "Twitch API call failed or token is invalid/expired." }, { status: 401 });
    }

    locals.twitchUser = user;
    
    return json(user);
};