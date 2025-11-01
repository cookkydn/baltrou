import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
	const PUBLIC_PATHS = ['/', '/login'];
	const currentPath = url.pathname;
	const isLoggedIn = !!locals.credentials.twitch;

	if (!isLoggedIn && !PUBLIC_PATHS.includes(currentPath)) {
		throw redirect(302, '/login');
	} else if (isLoggedIn && currentPath === '/login') {
		throw redirect(302, '/');
	}

	return {
		isLoggedIn: isLoggedIn
	};
};
