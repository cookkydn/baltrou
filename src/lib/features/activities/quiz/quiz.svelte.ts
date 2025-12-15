import type { App } from '$lib/state/app.svelte';
import { toasts } from '$lib/stores/toast-store';
import type { Quiz } from '$lib/types/quiz';

export class QuizModule {
	app: App;
	quizList: string[] = $state([]);
	loadedQuizzes: Quiz[] = $state([]);
  isLoaded = $state(false);
	constructor(app: App) {
		this.app = app;
		console.log('[QUIZ] Loaded');
	}

  async load() {
    if(this.isLoaded) return;
    const res = await fetch("/api/activities/quiz");
    if(res.ok) {
      const quizList: string[] = await res.json();
      this.quizList = quizList;
    } else {
      console.error(res.text);
      toasts.add("Failed to fetch quiz list",'error');
    }
    this.isLoaded = true;
  }

	async uploadQuiz(file: File) {
		const form = new FormData();
		form.set('file', file);
		const res = await fetch('/api/activities/quiz', { method: 'POST', body: form });
		if (res.ok) {
			const { quizId } = await res.json();
			this.quizList.push(quizId);
		} else {
      console.error(res.text);
			toasts.add('Failed to upload quiz', 'error');      
		}
	}

  async uploadQuizByURL(url: string) {
    const res = await(fetch('/api/activities/quiz',{method:'POST', body:JSON.stringify({url})}))
    if (res.ok) {
			const { quizId } = await res.json();
			this.quizList.push(quizId);
		} else {
      console.error(res.text);
			toasts.add('Failed to upload quiz', 'error');      
		}
  }

  async loadQuiz(quizId: string) {
    const res = await fetch(`/api/activities/quiz/${quizId}`);
    if(res.ok) {
      const quiz: Quiz = JSON.parse(await res.json());
      const index = this.loadedQuizzes.findIndex(q=>q.id == quiz.id);
      if(index == -1) {
        this.loadedQuizzes.push(quiz);
      } else {
        this.loadedQuizzes[index] = quiz;
      }
    } else {
      console.error(res.text);
      toasts.add("Failed to fetch quiz",'error');
    }
  }
}
