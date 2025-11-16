<script lang="ts">
	import AudioFader from '$lib/components/AudioFader.svelte';
	import PlayIcon from '$lib/components/icons/PlayIcon.svelte';
	import RefreshIcon from '$lib/components/icons/RefreshIcon.svelte';
	import ShortcutButton from '$lib/components/icons/ShortcutButton.svelte';
	import { getScenes, obsConnectionStatus, obsState, switchScene } from '$lib/stores/obs-store';
	let loading = false;
	async function updateState() {
		loading = true;
		await getScenes();
		loading = false;
	}
</script>

<h1>Contrôles du Stream <RefreshIcon on:click={updateState} {loading}></RefreshIcon></h1>
{#if $obsConnectionStatus == 'CONNECTED'}
	<div class="controls-grid">
		<!-- Shortcut Buttons -->
		<div class="shortcuts">
			<h2>Scènes</h2>
			<div class="buttons-grid">
				{#each $obsState.list as scene}
					<ShortcutButton
						name={scene}
						selected={$obsState.active == scene}
						on:click={() => switchScene(scene)}
					>
						<PlayIcon slot="icon" />
					</ShortcutButton>
				{/each}
			</div>
		</div>
	</div>

	<div class="controls-grid">
		<!-- Shortcut Buttons -->
		<div class="shortcuts">
			<h2>Audio</h2>
			<div class="faders-grid">
				{#each $obsState.audioSources as audioSource}
					<AudioFader
						active={audioSource.inCurrentScene}
						muted={audioSource.muted}
						name={audioSource.name}
						value={audioSource.value}
					></AudioFader>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="content-box">
		<p>OBS non connecté. Rendez vous dans les <a href="/settings">réglages</a></p>
	</div>
{/if}

<style>
	.controls-grid {
		display: grid;
		gap: 2rem;
	}

	.shortcuts h2 {
		margin-bottom: 1rem;
	}

	.buttons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}
	.faders-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, 100px);
		gap: 1rem;
	}

	a {
		color: lightblue;
	}
</style>
