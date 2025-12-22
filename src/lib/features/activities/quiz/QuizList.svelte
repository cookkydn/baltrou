<script lang="ts">
	import { appMode } from '$lib/stores/user-store';
	import type { QuizMetadata } from '$lib/types/activities/quiz';
	import Button from '$lib/ui/Button.svelte';
	import { Play, Trash } from '@lucide/svelte';

	let {
		quizzes = [],
		onStart,
		onDelete
	}: {
		quizzes: QuizMetadata[];
		onStart: (id: string) => void;
		onDelete: (id: string) => void;
	} = $props();
</script>

<div class="quiz-list">
	{#each quizzes as quiz}
		<div class="quiz-item card no-margin">
			<span class="quiz-name">{quiz.title} - {quiz.questionCount} questions</span>
			
			<div class="actions">
				<Button variant="success" onclick={() => onStart(quiz.id)} title="Lancer ce quiz">
					<Play size={16} />
					Lancer
				</Button>

				{#if $appMode === 'CONFIG'}
					<Button variant="danger" onclick={() => onDelete(quiz.id)} title="Supprimer">
						<Trash size={16} />
					</Button>
				{/if}
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>Aucun quiz disponible.</p>
		</div>
	{/each}
</div>

<style>
	.quiz-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.quiz-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.quiz-name {
		font-weight: 500;
		font-size: 1.1rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
    margin-left: 1em;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
		font-style: italic;
	}
</style>