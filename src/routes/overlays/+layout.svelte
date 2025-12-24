<script lang="ts">
	import { onMount } from 'svelte';
	import './overlays.css';
	import { events } from '$lib/stores/event-store';
	let { children } = $props();
	onMount(() => {
		$events;
	});
</script>

{@render children?.()}
