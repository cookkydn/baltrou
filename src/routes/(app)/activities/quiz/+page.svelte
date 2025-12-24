<script lang="ts">
	import { appMode } from '$lib/stores/user-store';
	import { getApp } from '$lib/state/app.svelte';
	import { onMount } from 'svelte';
	import QuizImporter from '$lib/features/activities/quiz/QuizImporter.svelte';
	import QuizList from '$lib/features/activities/quiz/QuizList.svelte';
	import QuizDisplay from '$lib/features/activities/quiz/QuizDisplay.svelte';
	const {
		activities: { quizModule, playersModule }
	} = getApp();
	onMount(() => {
		quizModule.load();
		playersModule.load();
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

	const handleStart = async (id: string) => {
		console.log('Start quiz:', id);
		await quizModule.loadQuiz(id);
		quizModule.updateState();
	};

	const handleAnwser = (playerId: string, anwser: string) => {
		if (!quizModule.liveState) {
			return;
		}
		if (quizModule.liveState.mode == 'speed') {
			const player = playersModule.players.find((p) => p.id == playerId);
			if (!player) {
				return;
			}
			if (Array.isArray(quizModule.liveState.question.correctOptionId)) {
				if (
					quizModule.liveState.question.correctOptionId.includes(
						quizModule.liveState.playerAnwsers[player.id]
					)
				) {
					playersModule.setScore(playerId, player.score + 1);
				} else {
					playersModule.setScore(playerId, player.score - 1);
				}
			} else {
				if (
					quizModule.liveState.playerAnwsers[player.id] ==
					quizModule.liveState.question.correctOptionId
				) {
					playersModule.setScore(playerId, player.score + 1);
				} else {
					playersModule.setScore(playerId, player.score - 1);
				}
			}
			quizModule.liveState.revealAnswer = true;
		} else {
			quizModule.liveState.playerAnwsers[playerId] = anwser;
			quizModule.liveState.currentPlayerIndex += 1;
			if (quizModule.liveState.currentPlayerIndex >= playersModule.players.length) {
				quizModule.liveState.revealAnswer = true;
				for (let player of playersModule.players) {
					if (Array.isArray(quizModule.liveState.question.correctOptionId)) {
						if (
							quizModule.liveState.question.correctOptionId.includes(
								quizModule.liveState.playerAnwsers[player.id]
							)
						) {
							playersModule.setScore(player.id, player.score + 1);
						}
					} else {
						if (
							quizModule.liveState.playerAnwsers[player.id] ==
							quizModule.liveState.question.correctOptionId
						) {
							playersModule.setScore(player.id, player.score + 1);
						}
					}
				}
				quizModule.liveState.currentPlayerIndex = 0;
			}
		}
		quizModule.updateState();
	};

	const handleNextQuestion = () => {
		if (!quizModule.liveState || !quizModule.loadedQuiz) {
			return;
		}
		quizModule.liveState.playerAnwsers = {};
		quizModule.liveState.revealAnswer = false;
		quizModule.liveState.questionNumber += 1;
		quizModule.liveState.question =
			quizModule.loadedQuiz?.questions[quizModule.liveState.questionNumber];
		quizModule.updateState();
	};
</script>

<div class="flex">
	<div class="group">
		{#if $appMode == 'CONFIG'}
			<QuizImporter class="card" {onFiles} {onUrl} />
		{/if}

		<div class="card">
			<h2>Quiz Disponibles</h2>
			<QuizList quizzes={quizModule.quizList} onStart={handleStart} onDelete={handleDelete} />
		</div>
	</div>
	{#if quizModule.liveState}
		<QuizDisplay
			activeQuiz={quizModule.liveState}
			players={playersModule.players}
			onAnswer={handleAnwser}
			onNextQuestion={handleNextQuestion}
			onQuizEnd={() => quizModule.endQuiz()}
		/>
	{/if}
</div>

<style>
	.flex {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1em;
	}
	.group {
		box-sizing: border-box;
		flex-grow: 1;
	}
	.card {
		margin: 0;
		margin-top: 1em;
	}
</style>
