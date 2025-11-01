import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.twitchUser) {
        return json({ message: "Not authenticated" }, { status: 401 });
    }

    return json(locals.twitchUser);
};