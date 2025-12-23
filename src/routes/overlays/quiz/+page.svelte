<script lang="ts">
	import { getApp } from '$lib/state/app.svelte';
	import { onMount } from 'svelte';
	import QuizDisplay from '$lib/features/activities/quiz/QuizDisplay.svelte';
	const {
		activities: { quizModule, playersModule }
	} = getApp();
	let currentAnswers: Record<string, string> = $state({});
	onMount(() => {
		quizModule.load();
		playersModule.load();
	});

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
				if (quizModule.liveState.question.correctOptionId.includes(currentAnswers[player.id])) {
					playersModule.setScore(playerId, player.score + 1);
				} else {
					playersModule.setScore(playerId, player.score - 1);
				}
			} else {
				if (currentAnswers[player.id] == quizModule.liveState.question.correctOptionId) {
					playersModule.setScore(playerId, player.score + 1);
				} else {
					playersModule.setScore(playerId, player.score - 1);
				}
			}
			quizModule.liveState.revealAnswer = true;
		} else {
			currentAnswers[playerId] = anwser;
			quizModule.liveState.currentPlayerIndex += 1;
			if (quizModule.liveState.currentPlayerIndex >= playersModule.players.length) {
				quizModule.liveState.revealAnswer = true;
				for (let player of playersModule.players) {
					if (Array.isArray(quizModule.liveState.question.correctOptionId)) {
						if (quizModule.liveState.question.correctOptionId.includes(currentAnswers[player.id])) {
							playersModule.setScore(player.id, player.score + 1);
						}
					} else {
						if (currentAnswers[player.id] == quizModule.liveState.question.correctOptionId) {
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
		currentAnswers = {};
		quizModule.liveState.revealAnswer = false;
		quizModule.liveState.questionNumber += 1;
		quizModule.liveState.question =
			quizModule.loadedQuiz?.questions[quizModule.liveState.questionNumber];
		quizModule.updateState();
	};
</script>

<div class="overlay-viewport">
	<div class="ratio-box">
		{#if quizModule.liveState}
			<QuizDisplay
				activeQuiz={quizModule.liveState}
				players={playersModule.players}
				onAnswer={handleAnwser}
				answers={currentAnswers}
				onNextQuestion={handleNextQuestion}
				onQuizEnd={() => quizModule.endQuiz()}
			/>
		{:else}
			<div class="waiting-card">
				<p>En attente du quiz...</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.overlay-viewport {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
	}

	.ratio-box {
		box-sizing: border-box;
		width: 100%;
		height: 90%;
		aspect-ratio: 16 / 10;

		display: flex;
		flex-direction: column;
		position: relative;
	}

	.ratio-box :global(.quiz-container) {
		height: 100%;
	}

	.waiting-card {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 2rem;
		border-radius: 1rem;
	}
</style>
