export const CONNECTION_STATUS = {
	CONNECTED: 'Connected',
	DISCONNECTED: 'Disconnected',
	CONNECTING: 'Connecting',
	RECONNECTING: 'Reconnecting',
	ERROR: 'Error'
};

export type ConnectionStatus = keyof typeof CONNECTION_STATUS;
