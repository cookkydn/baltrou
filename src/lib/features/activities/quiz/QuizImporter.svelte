<script lang="ts">
	import FileDropzone from '$lib/ui/FileDropzone.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { noop } from '$lib/utils';

	let {
		onFiles = noop,
		onUrl = noop,
		class: className = ''
	}: {
		onFiles: (files: File[]) => void;
		onUrl: (url: string) => void;
		class?: string;
	} = $props();

	let url = $state('');

	function handleUrlSubmit() {
		if (!url) return;
		onUrl(url);
		url = '';
	}
</script>

<div class="quiz-importer {className}">
	<h2>Importer un quiz</h2>
	<div class="section">
		<h3 class="label">Depuis un fichier</h3>
		<FileDropzone
			accept={['.json']}
			label="Glisser un fichier Quiz JSON ici"
			multiple={true}
			{onFiles}
		/>
	</div>

	<div class="separator">OU</div>

	<div class="section">
		<h3 class="label">Depuis une URL</h3>
		<div class="url-row">
			<div class="input-wrapper">
				<TextInput placeholder="https://example.com/quiz.json" bind:value={url} />
			</div>
			<Button variant="primary" onclick={handleUrlSubmit} disabled={!url}>Importer</Button>
		</div>
	</div>
</div>

<style>
	.quiz-importer {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin: 0;
	}

	.label {
		font-family: var(--font-body);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin: 0 0 0.5rem 0;
	}

	.separator {
		display: flex;
		align-items: center;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8rem;
		font-weight: bold;
	}
	.separator::before,
	.separator::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid var(--surface-border);
	}
	.separator::before {
		margin-right: 1rem;
	}
	.separator::after {
		margin-left: 1rem;
	}

	.url-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.input-wrapper {
		flex-grow: 1;
	}

	:global(.quiz-importer .url-row .form-group) {
		margin-bottom: 0;
	}
</style>
