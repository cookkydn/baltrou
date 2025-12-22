<script lang="ts">
	import type { ActiveQuiz, QuizOption } from '$lib/types/activities/quiz';
	import { noop } from '$lib/utils'; // Ou une fonction vide simple () => {}
	import { Zap } from '@lucide/svelte';

	let {
		activeQuiz,
		onAnswer = noop
	}: {
		activeQuiz: ActiveQuiz;
		onAnswer?: (optionId: string) => void;
	} = $props();

	let question = $derived(activeQuiz.question);
	let metadata = $derived(activeQuiz.metadata);
	let reveal = $derived(activeQuiz.revealAnswer);

	function isCorrect(optionId: string): boolean {
		const correct = question.correctOptionId;
		if (Array.isArray(correct)) {
			return correct.includes(optionId);
		}
		return correct === optionId;
	}

	function getOptionClass(optionId: string) {
		if (!reveal) return 'neutral';
		return isCorrect(optionId) ? 'correct' : 'incorrect';
	}
</script>

<div class="quiz-display card center">
	<div class="header">
		<span class="badge">Question {activeQuiz.questionNumber} / {metadata.questionCount}</span>
		{#if activeQuiz.mode === 'speed'}
			<span class="badge speed"><Zap />Speed</span>
		{/if}
	</div>

	<h2 class="question-text">{question.text}</h2>

	{#if question.image}
		<div class="image-container">
			<img src={question.image} alt="Illustration de la question" />
		</div>
	{/if}

	<div class="options-grid">
		{#each question.options as option (option.id)}
			<button
				class="option-btn {getOptionClass(option.id)}"
				disabled={reveal}
				onclick={() => onAnswer(option.id)}
			>
				<span class="option-label">{option.label}</span>
			</button>
		{/each}
	</div>

	{#if reveal && question.explanation}
		<div class="explanation">
			<strong>Explication :</strong>
			<p>{question.explanation}</p>
		</div>
	{/if}
</div>

<style>
	.quiz-display {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	.badge {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
	}

	.badge.speed {
		background: var(--accent-warning);
		color: #000;
		font-weight: 700;
		display: flex;
		align-items: center;
	}

	.question-text {
		font-size: 1.5rem;
		margin: 0;
		line-height: 1.3;
	}

	.image-container {
		display: flex;
		justify-content: center;
		background: rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-md);
		overflow: hidden;
		max-height: 300px;
	}

	.image-container img {
		max-width: 100%;
		max-height: 300px;
		object-fit: contain;
	}

	.options-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 600px) {
		.options-grid {
			grid-template-columns: 1fr;
		}
	}

	.option-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		font-size: 1.1rem;
		font-weight: 500;
		border: 2px solid var(--surface-border);
		background-color: var(--surface-color);
		color: var(--text-primary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}

	.option-btn:hover:not(:disabled) {
		background-color: var(--surface-hover);
		transform: translateY(-2px);
		border-color: var(--accent-primary);
	}

	.option-btn.correct {
		background-color: var(--accent-success);
		border-color: var(--accent-success);
		color: #000;
		font-weight: bold;
	}

	.option-btn.incorrect {
		opacity: 0.5;
		background-color: rgba(239, 68, 68, 0.1);
		border-color: var(--accent-danger);
	}

	.explanation {
		background-color: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border-radius: var(--radius-md);
		border-left: 4px solid var(--accent-info);
		text-align: left;
	}

	.explanation p {
		margin: 0.5rem 0 0 0;
		color: var(--text-secondary);
	}
</style>
