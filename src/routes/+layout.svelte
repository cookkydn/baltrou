<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { startListening, stopListening } from '$lib/background-service.js';
	import Footer from '$lib/components/Footer.svelte';
	import { auth } from '$lib/stores/auth-store.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	onMount(async () => {
		$auth.loggedIn = data.isLoggedIn;
		auth.subscribe((authState)=> {
			if(authState.loggedIn) startListening();
			else stopListening();
		})
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<nav>
		<a href="/">Accueil</a>
		<div>
			{#if data.isLoggedIn}
				<a href="/communaute">Communauté</a>
				<a href="/stats">Statistiques</a>
				<!-- 
				<a href="/controles">Contrôles</a>
				<a href="/ambiance">Ambiance</a>
				<a href="/annonces">Annonces</a>
				<a href="/reglages">Réglages</a> -->
			{:else}
				<a href="/login">Connexion</a>
			{/if}
		</div>
	</nav>
</header>

<main>
	{@render children?.()}
</main>

<Footer isLoggedIn={data.isLoggedIn}></Footer>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
	:root {
		--menu-bg: #290033;
	}
	:global(.content-box) {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 2rem;
		margin: 2rem;
		text-align: center;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background: linear-gradient(to right, #02177a, #62007a);
		color: white;
		font-family: 'Bebas Neue', cursive;
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
		color: white;
		text-decoration: none;
		padding: 0 1rem;
		position: relative;
		font-size: 1.2rem;
	}

	main {
		padding: 2rem;
		padding-bottom: 5rem; /* Add padding to avoid overlap with fixed footer */
	}

	nav a::after {
		content: '';
		position: absolute;
		width: 100%;
		transform: scaleX(0);
		height: 2px;
		bottom: -5px;
		left: 0;
		background-color: white;
		transform-origin: bottom right;
		transition: transform 0.25s ease-out;
	}

	nav a:hover::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}
</style>
