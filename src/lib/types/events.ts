export type SseEvent = {
	type: string;
	timestamp: Date;
	data: any;
};