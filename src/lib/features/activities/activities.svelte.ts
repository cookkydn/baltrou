import type { App } from '$lib/state/app.svelte';
import { BaseModule } from '$lib/state/base-module.svelte';
import { PlayersModule } from './players/players.svelte';
import { QuizModule } from './quiz/quiz.svelte';

export class Activities extends BaseModule {
	protected async onLoad() {}

	quizModule: QuizModule;
	playersModule: PlayersModule;
	constructor(app: App) {
		super(app);
		this.quizModule = new QuizModule(app);
		this.playersModule = new PlayersModule(app);
	}
}
