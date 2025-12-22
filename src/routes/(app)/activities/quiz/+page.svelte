<script lang="ts">
	import { appMode } from '$lib/stores/user-store';
	import { getApp } from '$lib/state/app.svelte';
	import { onMount } from 'svelte';
	import QuizImporter from '$lib/features/activities/quiz/QuizImporter.svelte';
	import QuizList from '$lib/features/activities/quiz/QuizList.svelte';
	import QuizDisplay from '$lib/features/activities/quiz/QuizDisplay.svelte';
	const {
		activities: { quizModule }
	} = getApp();
	onMount(() => {
		quizModule.load();
	});
	async function onFiles(files: File[]) {
		for (let file of files) {
			quizModule.uploadQuiz(file);
		}
	}

	async function onUrl(url: string) {
		quizModule.uploadQuizByURL(url);
	}

	const handleDelete = async (id: string) => {
		if (confirm(`Supprimer le quiz "${id}" ?`)) {
			await quizModule.deleteQuiz(id);
		}
	};

	const handleStart = (id: string) => {
		console.log('Start quiz:', id);
		quizModule.loadQuiz(id);
	};
</script>

{#if $appMode == 'CONFIG'}
	<QuizImporter class="card" {onFiles} {onUrl} />
{/if}

<div class="card">
	<h2>Quiz Disponibles</h2>
	<QuizList quizzes={quizModule.quizList} onStart={handleStart} onDelete={handleDelete} />
</div>
{#if quizModule.liveState}
	<QuizDisplay activeQuiz={quizModule.liveState} />
{/if}
