import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    if(locals.twitchCredentials == null) {
        // User is not logged in
        return {
            isLoggedIn: false
        };
    }
    return {
        isLoggedIn: true
    }
};