import type { App } from "$lib/state/app.svelte";
import { QuizModule } from "./quiz/quiz.svelte";

export class Activities {
  app: App;
  quizModule: QuizModule;
  constructor(app: App) {
    console.log("[ACTIVITIES] Loading activities...")
    this.app = app;
    this.quizModule = new QuizModule(app);
    console.log("[ACTIVITIES] Loaded")
  }
}