<script lang="ts">
	import Shelf, { type ShelfItem } from '$lib/components/layout/Shelf.svelte';
	import { MessageCircleQuestionMark, House } from '@lucide/svelte';
  import { page } from '$app/state';
	import { goto } from '$app/navigation';
	const activities: ShelfItem[] = [
		{ id: '', label: 'Home', icon: House },
		{ id: 'quiz', label: 'Quiz', icon: MessageCircleQuestionMark },
	];

	let currentActivityId = $derived(page.url.pathname == '/activities' ? '' : page.url.pathname.split('/').pop() || '');

	function handleSelect(id: string) {
		goto(`/activities/${id}`)
	}

  const {children} = $props()
</script>
<div class="page">
  <aside class="sidebar">
    <Shelf items={activities} activeId={currentActivityId} onselect={handleSelect} />
  </aside>
  <section>
    {@render children?.()}
  </section>
</div>

<style>
  .page{
    display: flex;
    height: 100%;
  }

  aside {
    flex-shrink: 0;
    height: 100%;
    z-index: 10;
  }
  section {
    padding: 2em 2rem 4em;
  }
</style>