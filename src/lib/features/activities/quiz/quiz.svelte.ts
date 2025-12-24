import type { App } from '$lib/state/app.svelte';
import { events } from '$lib/stores/event-store';
import { toasts } from '$lib/stores/toast-store';
import type { ActiveQuiz, Quiz, QuizMetadata } from '$lib/types/activities/quiz';

export class QuizModule {
	app: App;
	quizList: QuizMetadata[] = $state([]);
	loadedQuiz: Quiz | null = $state(null);
	liveState: ActiveQuiz | null = $state(null);
	isLoaded = $state(false);
	constructor(app: App) {
		this.app = app;
		this.listenToUpdates();
		console.log('[QUIZ] Loaded');
	}

	async load() {
		if (this.isLoaded) return;
		let res = await fetch('/api/activities/quiz');
		if (res.ok) {
			const quizList: QuizMetadata[] = await res.json();
			this.quizList = quizList;
		} else {
			console.error(res.text);
			toasts.add('Failed to fetch quiz list', 'error');
		}
		console.log(`[QUIZ] Loaded ${this.quizList.length} quizzes`);
		res = await fetch('/api/activities/quiz/live');
		if (res.ok) {
			const liveState: ActiveQuiz = await res.json();
			if (liveState != null) {
				await this.loadQuiz(liveState.metadata.id);
				this.liveState = liveState;
			}
		} else {
			console.error(res.text);
			toasts.add('Failed to fetch active quiz', 'error');
		}
		if (this.liveState) {
			console.log(`[QUIZ] Loaded active quiz`);
		}
		this.isLoaded = true;
	}

	private listenToUpdates() {
		console.log('[QUIZ] Started listening...');
		events.subscribe((e) => {
			if (e?.type == 'quiz_update') {
				console.log('[QUIZ] Received an update');
				this.isLoaded = false;
				this.load();
			}
		});
	}

	async uploadQuiz(file: File) {
		const form = new FormData();
		form.set('file', file);
		const res = await fetch('/api/activities/quiz', { method: 'POST', body: form });
		if (res.ok) {
			const metadata = await res.json();
			this.quizList.push(metadata);
			this.removeDuplicates();
			console.log(`[QUIZ] Uploaded quiz file ${file.name}`);
		} else {
			console.error(res.text);
			toasts.add('Failed to upload quiz', 'error');
		}
	}

	async uploadQuizByURL(url: string) {
		const res = await fetch('/api/activities/quiz', {
			method: 'POST',
			body: JSON.stringify({ url })
		});
		if (res.ok) {
			const metadata = await res.json();
			this.quizList.push(metadata);
			this.removeDuplicates();
			console.log(`[QUIZ] Uploaded quiz url ${url}`);
		} else {
			console.error(res.text);
			toasts.add('Failed to upload quiz', 'error');
		}
	}

	async loadQuiz(quizId: string) {
		const res = await fetch(`/api/activities/quiz/${quizId}`);
		if (res.ok) {
			const quiz: Quiz = await res.json();
			this.loadedQuiz = quiz;
			this.liveState = {
				metadata: {
					id: quiz.id,
					questionCount: quiz.questions.length,
					title: quiz.title
				},
				question: quiz.questions[0],
				questionNumber: 0,
				revealAnswer: false,
				mode: quiz.mode,
				currentPlayerIndex: 0,
				playerAnwsers: {}
			};
			console.log(`[QUIZ] loaded quiz ${quizId}`);
		} else {
			console.error(res.text);
			toasts.add('Failed to fetch quiz', 'error');
		}
	}

	async deleteQuiz(quizId: string) {
		const res = await fetch(`/api/activities/quiz/${quizId}`, { method: 'DELETE' });
		if (res.ok) {
			this.quizList = this.quizList.filter((q) => q.id !== quizId);
			toasts.add(`Quiz supprimé`, 'success');
			console.log(`[QUIZ] Deleted quiz ${quizId}`);
		} else {
			console.error(await res.text());
			toasts.add('Erreur lors de la suppression du quiz', 'error');
		}
	}

	async endQuiz() {
		this.loadedQuiz = null;
		this.liveState = null;
		const res = await fetch('/api/activities/quiz/live', {
			method: 'POST',
			body: JSON.stringify(null)
		});
		if (res.ok) {
			toasts.add('Quiz terminé', 'success');
		} else {
			console.error(await res.text());
			toasts.add('Erreur lors de la complétion du quiz', 'error');
		}
	}

	async updateState() {
		const res = await fetch('/api/activities/quiz/live', {
			method: 'POST',
			body: JSON.stringify(this.liveState)
		});
		if (!res.ok) {
			console.error(await res.text());
			toasts.add("Erreur lors de l'update du quiz", 'error');
		}
	}

	private removeDuplicates() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const ids = new Set();
		const uniquesQuizzes = this.quizList.filter(({ id }) => !ids.has(id) && ids.add(id));
		this.quizList = uniquesQuizzes;
	}
}
