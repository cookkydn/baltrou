import { runTwitchUpdateCron } from '$lib/server/cron';
import { ircManager } from '$lib/server/irc';
import cron from 'node-cron'
console.log('[HOOKS] Démarrage des services de fond...');

ircManager.connect();
console.log('[HOOKS] Bot TMI démarré et en attente...');

cron.schedule('*/1 * * * *', runTwitchUpdateCron);
console.log('[HOOKS] Tâche CRON planifiée (toutes les minutes)');

console.log('[HOOKS] Services de fond démarrés');

export async function handle({event,resolve}) {
    return await resolve(event); 
}