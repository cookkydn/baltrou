export function load({ cookies, url }) {
	const userId = url.searchParams.get('user_id');
	if (userId) {
		cookies.set('user_id', userId, {
			path: '/',
			secure: false,
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7
		});
	}
}
