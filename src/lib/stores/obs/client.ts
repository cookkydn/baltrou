import { writable, get, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import OBSWebSocket from 'obs-websocket-js';

const obsClient = new OBSWebSocket();
export type ObsConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export interface ObsSettings {
	host: string;
	port: number;
	password?: string;
}

const LOCAL_STORAGE_KEY = 'baltrou_obs_settings';

// Store d'état de connexion
const status = writable<ObsConnectionStatus>('DISCONNECTED');

// Fonctions utilitaires pour les paramètres
function loadSettings(): ObsSettings | null {
	if (!browser) return null;
	const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
	return stored ? JSON.parse(stored) : null;
}

function saveSettings(settings: ObsSettings) {
	if (browser) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
}

async function connect() {
	const settings = loadSettings();
	if (!settings) {
		status.set('ERROR');
		return;
	}

	if (get(status) === 'CONNECTED' || get(status) === 'CONNECTING') return;

	status.set('CONNECTING');
	try {
		await obsClient.connect(`ws://${settings.host}:${settings.port}`, settings.password);
		// L'événement 'Identified' gérera le passage à 'CONNECTED'
	} catch (err) {
		console.error('[OBS] Erreur de connexion:', err);
		status.set('ERROR');
	}
}

async function disconnect() {
	await obsClient.disconnect();
	status.set('DISCONNECTED');
}

export type ObsClient = {
    _client: OBSWebSocket;
    status: Writable<ObsConnectionStatus>;
    loadSettings: () => ObsSettings | null;
    saveSettings: (settings: ObsSettings) => void;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
};

export function createObsClient() {
	return {
		_client: obsClient,
		status,
		loadSettings,
		saveSettings,
		connect,
		disconnect,

	};
}
