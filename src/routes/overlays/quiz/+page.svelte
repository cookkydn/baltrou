<script lang="ts">
	import { getApp } from '$lib/state/app.svelte';
	import { onMount } from 'svelte';
	import QuizDisplay from '$lib/features/activities/quiz/QuizDisplay.svelte';
	import { noop } from 'chart.js/helpers';
	const {
		activities: { quizModule, playersModule }
	} = getApp();
	onMount(() => {
		quizModule.load();
		playersModule.load();
	});

	const handleAnwser = noop;
	const handleNextQuestion = noop;
</script>

<div class="overlay-viewport">
	<div class="ratio-box">
		{#if quizModule.liveState}
			<QuizDisplay
				activeQuiz={quizModule.liveState}
				players={playersModule.players}
				onAnswer={handleAnwser}
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
