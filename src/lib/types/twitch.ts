export class TwitchApiError extends Error {
	status: number;
	// Ajout d'un champ pour contenir les détails de l'erreur JSON de Twitch
	details: string;

	constructor(status: number, message: string, details?: string) {
		super(message);
		this.status = status;
		this.details = details || 'unknown error';
		this.name = 'TwitchApiError';
	}
}

export interface TwitchChatResponse {
	message_id: string;
	is_sent: boolean;
}
export interface TwitchGetStreamsRes {
	data: {
		id: string;
		user_id: string;
		user_login: string;
		user_name: string;
		game_id: string;
		game_name: string;
		title: string;
		tags: string;
		viewer_count: number;
		started_at: string;
	}[];
}

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