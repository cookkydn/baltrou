import { ircManager } from '$lib/server/irc';

console.log('[HOOKS] Démarrage des services de fond...');

ircManager.connect();
console.log('[HOOKS] Bot TMI démarré et en attente...');
console.log('[HOOKS] Services de fond démarrés');

export async function handle({event,resolve}) {
    return await resolve(event); 
}