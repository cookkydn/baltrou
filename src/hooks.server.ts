import { building } from '$app/environment';
import { runTwitchUpdateCron } from '$lib/server/cron';
import { ircManager } from '$lib/server/irc';
import { initSoundboardFolder } from '$lib/server/soundboard';
import cron from 'node-cron';

console.log('[HOOKS] Starting services');
initSoundboardFolder();
console.log('[HOOKS] Soundboard started');

console.log('[HOOKS] Starting background tasks');

ircManager.connect();
console.log('[HOOKS] TMI client connected');

cron.schedule('*/1 * * * *', runTwitchUpdateCron);
console.log('[HOOKS] CRON Tasks planified');

console.log('[HOOKS] All background services up');

export async function handle({ event, resolve }) {
	return await resolve(event);
}

if (!building) {
	function shutdownGracefully(signal: string) {
		console.log(`Received ${signal}. Starting graceful shutdown...`);
		process.exit(0);
	}

	// SIGINT is sent when you press Ctrl+C locally
	process.on('SIGINT', () => shutdownGracefully('SIGINT'));

	// SIGTERM is sent by Systemd when you run 'systemctl stop'
	process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
}
