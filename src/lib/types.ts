/**
 * @deprecated
 */
export type TwitchUser = {
	id: string;
	login: string;
	display_name: string;
	type: '' | 'admin' | 'global_mod' | 'staff';
	broadcaster_type: '' | 'affiliate' | 'partner';
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	email: string;
	created_at: string;
};
/**
 * @deprecated
 */
export type TwitchCredentials = {
	userId: string;
	token: string;
	refreshToken: string;
};

/**
 * @deprecated
 */
export type ChatMessage = {
	id: string;
	user: string;
	message: string;
	color: string;
};