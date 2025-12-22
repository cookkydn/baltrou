import type { App } from '$lib/state/app.svelte';
import { PlayersModule } from './players/players.svelte';
import { QuizModule } from './quiz/quiz.svelte';

export class Activities {
	app: App;
	quizModule: QuizModule;
	playersModule: PlayersModule;
	constructor(app: App) {
		console.log('[ACTIVITIES] Loading activities...');
		this.app = app;
		this.quizModule = new QuizModule(app);
		this.playersModule = new PlayersModule(app);
		console.log('[ACTIVITIES] Loaded');
	}
}
