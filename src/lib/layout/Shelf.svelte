<script lang="ts">
  import type { Icon } from "@lucide/svelte";

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
</style>