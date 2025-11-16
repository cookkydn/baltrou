<!--
  Composant "Icône Bouton Rafraîchir"
  Composant "stupide" (dumb component) qui n'a pas de logique interne.
  - Accepte une prop 'loading' pour l'animation.
  - Accepte une prop 'disabled'.
  - Émet un événement 'click' lorsque cliqué.
-->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/** Si true, affiche l'animation de rotation */
	export let loading = false;

	/** Si true, désactive le bouton */
	export let disabled = false;

	const dispatch = createEventDispatcher();

	function onClick(e: MouseEvent) {
		// Ne rien faire si on charge déjà ou si désactivé
		if (loading || disabled) return;

		// Transférer l'événement click au parent
		dispatch('click', e);
	}
</script>

<button
	class="refresh-icon-button"
	on:click={onClick}
	disabled={loading || disabled}
	title="Rafraîchir"
>
	<div class="icon" class:loading>
		<!-- Icône SVG "refresh" -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</svg>
	</div>
</button>

<style>
	.refresh-icon-button {
		/* Style minimaliste pour n'être qu'une icône */
		background: none;
		border: none;
		color: white;
		padding: 0.25rem; /* Petit padding pour la zone de clic */
		border-radius: 99px; /* Rond */
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.refresh-icon-button:hover:not(:disabled) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.refresh-icon-button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Animation de rotation */
	.icon.loading svg {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
