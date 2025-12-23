<script lang="ts">
	import { lightApiUrl } from '$lib/stores/fiak-store';
	import { Spotlight, type Icon } from '@lucide/svelte';

	export interface ShelfItem {
		id: string;
		label: string;
		icon: typeof Icon;
	}

	let {
		items = [],
		activeId = '',
		onselect
	}: {
		items: ShelfItem[];
		activeId: string;
		onselect?: (id: string) => void;
	} = $props();

	function onRedAction() {
		fetch(`${$lightApiUrl}/pulse/255/0/0/1`);
	}

	function onGreenAction() {
		fetch(`${$lightApiUrl}/pulse/0/255/0/1`);
	}
</script>

<nav class="shelf-container">
	<ul class="shelf-list">
		{#each items as item (item.id)}
			<li>
				<button
					class="shelf-item"
					class:active={activeId === item.id}
					onclick={() => onselect?.(item.id)}
					role="link"
					title={item.label}
				>
					<div class="active-indicator"></div>

					<div class="icon-wrapper">
						<item.icon />
					</div>

					<span class="label">{item.label}</span>
				</button>
			</li>
		{/each}
	</ul>
	<div class="bottom-actions">
		<button class="action-btn green" onclick={onGreenAction} title="Action verte"
			><Spotlight color="white" /></button
		>
		<button class="action-btn red" onclick={onRedAction} title="Action rouge"
			><Spotlight color="white" /></button
		>
	</div>
</nav>

<style>
	.shelf-container {
		width: 80px;
		height: 100%;
		background-color: var(--surface-color, rgba(255, 255, 255, 0.05));
		border-right: 1px solid var(--surface-border, rgba(255, 255, 255, 0.1));
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
		box-sizing: border-box;
		backdrop-filter: blur(10px);
	}

	.shelf-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
	}

	.shelf-list li {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.shelf-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background: transparent;
		border: none;
		border-radius: var(--radius-md, 8px);
		cursor: pointer;
		color: var(--text-secondary, rgba(255, 255, 255, 0.7));
		transition: all 0.2s ease;
		padding: 0;
	}

	.shelf-item:hover {
		background-color: var(--surface-hover, rgba(255, 255, 255, 0.1));
		color: var(--text-primary, white);
	}
	.shelf-item.active {
		color: var(--accent-primary, #9146ff);
		background-color: rgba(145, 70, 255, 0.15);
	}

	.active-indicator {
		position: absolute;
		left: -10px;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		height: 0%;
		background-color: var(--accent-primary, #9146ff);
		border-radius: 0 4px 4px 0;
		transition: height 0.2s ease;
	}

	.shelf-item.active .active-indicator {
		height: 60%;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
	}

	.label {
		font-family: var(--font-body, sans-serif);
		font-size: 0.7rem;
		margin-top: 4px;
		opacity: 0.8;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}

	@media (max-height: 500px) {
		.label {
			display: none;
		}
	}

	.bottom-actions {
		/* "auto" pousse cet élément tout en bas du conteneur flex parent */
		margin-top: auto;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
		width: 100%;
		padding-top: 1rem; /* Petit espace de sécurité avec la liste */
	}

	.action-btn {
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 50%; /* Cercle (met 'var(--radius-md, 8px)' si tu veux des carrés arrondis) */
		cursor: pointer;
		transition:
			transform 0.2s,
			filter 0.2s;
		/* Ombre légère pour donner du volume */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.action-btn:hover {
		transform: scale(1.1);
		filter: brightness(1.1);
	}

	.action-btn:active {
		transform: scale(0.95);
	}

	/* Couleurs */
	.action-btn.green {
		background-color: var(--accent-success, #22c55e);
	}

	.action-btn.red {
		background-color: var(--accent-danger, #ef4444);
	}
</style>
