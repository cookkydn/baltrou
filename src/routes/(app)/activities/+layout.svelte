<script lang="ts">
	import Shelf, { type ShelfItem } from '$lib/layout/Shelf.svelte';
	import { MessageCircleQuestionMark, House, User } from '@lucide/svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	const activities: ShelfItem[] = [
		{ id: '', label: 'Home', icon: House },
		{ id: 'players', label: 'Joueurs', icon: User },
		{ id: 'quiz', label: 'Quiz', icon: MessageCircleQuestionMark }
	];

	let currentActivityId = $derived(
		page.url.pathname == '/activities' ? '' : page.url.pathname.split('/').pop() || ''
	);

	function handleSelect(id: string) {
		goto(`/activities/${id}`);
	}

	const { children } = $props();
</script>

<div class="page">
	<aside class="sidebar">
		<Shelf items={activities} activeId={currentActivityId} onselect={handleSelect} />
	</aside>
	<section>
		<div class="content-wrapper">
			{@render children?.()}
		</div>
	</section>
</div>

<style>
	.page {
		display: flex;
		height: 100vh;
		overflow: hidden;
		width: 100%;
	}

	aside {
		flex-shrink: 0;
		height: 100%;
		z-index: 10;
	}
	section {
		flex-grow: 1;
		overflow-y: auto;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.content-wrapper {
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
		padding: 2rem 2rem 3rem;
		box-sizing: border-box;
		min-height: min-content;
	}
</style>
