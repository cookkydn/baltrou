<script lang="ts">
	import DebugPanel from '$lib/components/debug/DebugPanel.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { appMode, auth, timer } from '$lib/stores/user-store.js';
	import { chat } from '$lib/stores/chat-store.js';
	import { stats } from '$lib/stores/stats-store.js';
	import { onMount } from 'svelte';
	import './app.css';
	import { obs } from '$lib/stores/obs';
	import { ConnectionStatus } from '$lib/types/status';
	import { quickLinks } from '$lib/stores/quick-links-store';
	import { getUserInfo } from '$lib/services/auth.service';
	import { events } from '$lib/stores/event-store';

	let { children } = $props();
	const status = obs.client.status;
	onMount(async () => {
		$chat;
		$stats;
		$events;
		$auth = false;
		obs.init();
		const user = await getUserInfo();
		if (user) {
			quickLinks.set(user.quickLinks);
			appMode.set(user.isInConfigMode ? 'CONFIG' : 'STREAM');
			if (user.timerTargetDate) {
				timer.set(new Date(user.timerTargetDate));
			} else {
				timer.remove();
			}
			auth.set(true);
		} else {
			auth.set(false);
		}
	});
</script>
<ToastContainer />
<div class="app">
	<header>
		<nav>
			<a href="/">Accueil</a>
			<div>
				{#if $auth}
					<a href="/community">Communauté</a>
					<a href="/stats">Statistiques</a>
					<a href="/ambiance">Ambiance</a>
					{#if $status == ConnectionStatus.CONNECTED}
						<a href="/controls">Contrôles</a>
					{/if}
					{#if $appMode == 'CONFIG'}
						<a href="/soundboard">Soundboard</a>
					{/if}
					<a href="/activities">Activités</a>
					<a href="/settings">Réglages</a>
				{:else}
					<a href="/login">Connexion</a>
				{/if}
			</div>
		</nav>
	</header>

	<DebugPanel></DebugPanel>
	<main>
		{@render children?.()}
	</main>

	<Footer isLoggedIn={$auth}></Footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh; 
		width: 100vw;
	}

	header {
		flex-shrink: 0;
		background-color: var(--menu-bg);
		padding: 1rem;
		z-index: 20;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	main {
		flex-grow: 1; 
		overflow-y: auto; 
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		padding: 0;
		box-sizing: border-box;
	}

	:global(footer) {
		flex-shrink: 0;
		z-index: 20;
	}

	header {
		background-color: var(--menu-bg);
		padding: 1rem;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	nav a {
		color: var(--text-primary);
		font-family: var(--font-heading), cursive;
		text-decoration: none;
		padding: 0 1rem;
		position: relative;
		font-size: 1.2rem;
	}

	nav a::after {
		content: '';
		position: absolute;
		width: 100%;
		transform: scaleX(0);
		height: 2px;
		bottom: -5px;
		left: 0;
		background-color: var(--text-primary);
		transform-origin: bottom right;
		transition: transform 0.25s ease-out;
	}

	nav a:hover::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}
</style>
