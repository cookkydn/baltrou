<script lang="ts">
	import { App, initApp } from '$lib/state/app.svelte';
	import './root.css';
	initApp(new App());
</script>

<slot />
