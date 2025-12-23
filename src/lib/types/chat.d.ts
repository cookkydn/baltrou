export interface ChatMessage {
	id: string;
	user: string;
	color?: string;
	badges?: Record<string, string>;
	message: string;
}
