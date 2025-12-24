<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Trophy, Timer, Zap, CheckCircle, Frown } from '@lucide/svelte';
	import PlayerAvatar from '../players/PlayerAvatar.svelte';
	import type { ActiveQuiz } from '$lib/types/activities/quiz';
	import type { Player } from '$lib/types/activities/players';

	interface Props {
		activeQuiz: ActiveQuiz;
		players: Player[];
		onAnswer?: (playerId: string, answerId: string) => void;
		onNextQuestion?: () => void;
		onQuizEnd?: () => void;
	}

	let { activeQuiz, players, onAnswer, onNextQuestion, onQuizEnd }: Props = $props();

	let speedWinnerId = $state<string | null>(null);
	let showWinnerSelection = $state(false);
	let pendingOptionId = $state<string | null>(null);

	let currentPlayer = $derived(players[activeQuiz.currentPlayerIndex]);

	function isOptionCorrect(optionId: string) {
		return Array.isArray(activeQuiz.question.correctOptionId)
			? activeQuiz.question.correctOptionId.includes(optionId)
			: activeQuiz.question.correctOptionId === optionId;
	}

	function handleOptionClick(optionId: string) {
		if (activeQuiz.revealAnswer) return;

		if (activeQuiz.mode === 'speed') {
			pendingOptionId = optionId;
			showWinnerSelection = true;
		} else {
			// Mode Standart
			onAnswer?.(currentPlayer.id, optionId);
		}
	}

	function selectWinner(playerId: string) {
		if (pendingOptionId) {
			speedWinnerId = playerId;
			onAnswer?.(playerId, pendingOptionId);
			showWinnerSelection = false;
		}
	}

	const handleNextQuestion = () => {
		speedWinnerId = null;
		showWinnerSelection = false;
		pendingOptionId = null;
		onNextQuestion?.();
	};
</script>

<div class="card quiz-container">
	{#if showWinnerSelection}
		<div class="winner-overlay" transition:fade>
			<div class="selection-card card" transition:scale>
				<h3>Qui a répondu ?</h3>
				<div class="players-selection-grid">
					{#each players as player}
						<button class="player-select-btn" onclick={() => selectWinner(player.id)}>
							<PlayerAvatar {player} />
							<span>{player.name}</span>
						</button>
					{/each}
				</div>
				<button class="btn btn-danger" onclick={() => (showWinnerSelection = false)}>Annuler</button
				>
			</div>
		</div>
	{/if}

	<div class="quiz-header">
		<div class="quiz-meta">
			<span class="badge"
				>Question {activeQuiz.questionNumber + 1} / {activeQuiz.metadata.questionCount}</span
			>
			<div class="mode-tag" class:speed={activeQuiz.mode === 'speed'}>
				{#if activeQuiz.mode === 'speed'}
					<Zap size={14} /> SPEED
				{:else}
					<Timer size={14} /> TOUR PAR TOUR
				{/if}
			</div>
		</div>
		<h2 class="question-text">{activeQuiz.question.text}</h2>
		{#if activeQuiz.question.image}
			<img src={activeQuiz.question.image} alt="Question" class="question-image" />
		{/if}
	</div>

	<div class="quiz-layout" in:fade>
		<div
			class="turn-banner"
			class:success={activeQuiz.revealAnswer}
			class:failed={activeQuiz.mode === 'speed' &&
				pendingOptionId &&
				!isOptionCorrect(pendingOptionId)}
			class:hidden={activeQuiz.mode == 'standart' && activeQuiz.revealAnswer}
		>
			{#if activeQuiz.revealAnswer}
				{#if activeQuiz.mode == 'speed'}
					{@const winner = players.find((p) => p.id === speedWinnerId)}
					<div class="banner-content" in:scale>
						{#if pendingOptionId && isOptionCorrect(pendingOptionId)}
							<Trophy size={20} class="icon-yellow" />
							<p><strong>{winner?.name || 'Inconnu'}</strong> a trouvé la bonne réponse !</p>
						{:else if pendingOptionId && !isOptionCorrect(pendingOptionId)}
							<Frown size={20} class="icon-yellow" />
							<p><strong>{winner?.name || 'Inconnu'}</strong> s'est trompé !</p>
						{/if}
					</div>
				{/if}
			{:else if activeQuiz.mode === 'standart'}
				<PlayerAvatar player={currentPlayer} />
				<p>C'est au tour de <strong>{currentPlayer?.name}</strong></p>
			{:else}
				<Zap size={20} class="icon-yellow" />
				<p>Le premier qui répond correctement l'emporte !</p>
			{/if}
		</div>

		<div class="options-grid">
			{#each activeQuiz.question.options as option}
				{@const isCorrect = activeQuiz.revealAnswer && isOptionCorrect(option.id)}
				<button
					class="btn option-btn"
					class:correct={isCorrect}
					class:disabled={activeQuiz.revealAnswer}
					onclick={() => handleOptionClick(option.id)}
				>
					<span class="option-label">{option.label}</span>
					{#if isCorrect}<CheckCircle size={18} class="icon-right" />{/if}
				</button>
			{/each}
		</div>

		{#if activeQuiz.mode === 'standart'}
			<div class="player-bubbles">
				{#each players as player (player.id)}
					<div
						class="player-status"
						class:active={player.id === currentPlayer?.id || activeQuiz.revealAnswer}
					>
						<PlayerAvatar {player} />
						<div
							class="bubble"
							class:has-answered={activeQuiz.playerAnwsers[player.id]}
							class:correct={activeQuiz.revealAnswer &&
								isOptionCorrect(activeQuiz.playerAnwsers[player.id])}
						>
							{activeQuiz.playerAnwsers[player.id] ? 'Répondu' : '...'}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if activeQuiz.revealAnswer}
			{#if activeQuiz.question.explanation}
				<div class="explanation-box" in:fade>
					<p>{activeQuiz.question.explanation}</p>
				</div>
			{/if}

			<div class="quiz-actions">
				{#if activeQuiz.questionNumber < activeQuiz.metadata.questionCount - 1}
					<button class="btn btn-primary next-btn" onclick={handleNextQuestion}
						>Question suivante</button
					>
				{:else}
					<button class="btn btn-primary next-btn" onclick={onQuizEnd}>Finir le quiz</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.quiz-container {
		display: flex;
		flex-direction: column;
		padding: 2rem;
		max-width: 800px;
		text-align: center;
		height: 100%;
		margin: 0;
		flex-grow: 1;
	}

	.badge {
		background: var(--surface-hover);
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-full);
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.mode-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 800;
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-sm);
		background: var(--accent-info);
	}

	.mode-tag.speed {
		background: var(--accent-warning);
		color: black;
	}

	.question-text {
		font-family: var(--font-heading);
		font-size: 2.2rem;
		margin: 1rem 0;
	}

	.question-image {
		max-width: 100%;
		max-height: 300px;
		border-radius: var(--radius-md);
		margin-bottom: 1.5rem;
	}

	/* --- Default Style --- */
	.turn-banner {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 0.5rem 1.5rem;
		border-radius: var(--radius-full);
		margin-bottom: 2rem;
		border: 1px solid var(--accent-primary);
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.option-btn {
		height: auto;
		padding: 1.25rem;
		font-size: 1.1rem;
		justify-content: space-between;
		background: var(--surface-color);
		border: 1px solid var(--surface-border);
	}

	.option-btn.correct {
		background: var(--accent-success);
		border-color: #fff;
		color: white;
	}

	/* --- Player Bubbles --- */
	.player-bubbles {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.player-status {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		opacity: 0.5;
	}

	.player-status.active {
		opacity: 1;
	}

	.bubble {
		background: var(--surface-hover);
		padding: 0.2rem 0.8rem;
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
		min-width: 60px;
	}

	.bubble.has-answered {
		background: var(--accent-primary);
	}

	.bubble.correct {
		background: var(--accent-success);
		border-color: #fff;
		color: white;
	}
	/* Styles de base */
	.quiz-container {
		display: flex;
		flex-direction: column;
		padding: 2rem;
		max-width: 800px;
		text-align: center;
		position: relative;
	}

	.question-text {
		font-family: var(--font-heading);
		font-size: 2.2rem;
		margin: 1rem 0;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	.option-btn {
		padding: 1.25rem;
		font-size: 1.1rem;
		justify-content: space-between;
		background: var(--surface-color);
		border: 1px solid var(--surface-border);
	}

	.option-btn.correct {
		background: var(--accent-success);
		color: white;
		border-color: white;
	}

	/* Overlay de sélection */
	.winner-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		color: white;
		backdrop-filter: blur(4px);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
	}

	.selection-card {
		background: var(--menu-bg);
		padding: 2rem;
		width: 90%;
		max-width: 400px;
	}

	.players-selection-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.player-select-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--surface-color);
		border: 1px solid var(--surface-border);
		border-radius: var(--radius-md);
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.player-select-btn:hover {
		background: var(--surface-hover);
		border-color: var(--accent-primary);
	}

	.turn-banner {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-full);
		margin: 1rem auto;
		border: 1px solid var(--accent-primary);
	}

	.turn-banner.success {
		background: rgba(34, 197, 94, 0.2);
		border-color: var(--accent-success);
	}
	.turn-banner.failed {
		background: rgba(34, 197, 94, 0.2);
		border-color: var(--accent-danger);
	}
	.turn-banner.hidden {
		display: none;
	}

	.next-btn {
		width: 100%;
		margin-top: 1.5rem;
		padding: 1rem;
	}

	.explanation-box {
		margin-top: 1.5rem;
		padding: 1rem;
		background: var(--surface-hover);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--accent-info);
		text-align: left;
	}

	.explanation-box p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.4;
		color: var(--text-primary);
	}
</style>
