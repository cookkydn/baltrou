<script lang="ts">
	import { Check, Folder, TriangleAlert } from '@lucide/svelte';

	// 1. Définition des Props avec une interface TypeScript
	interface Props {
		accept?: string[];
		multiple?: boolean;
		label?: string;
		mini?: boolean;
		// Voici le remplaçant de l'événement : un callback prop
		onFiles?: (files: File[]) => void;
	}

	// 2. Récupération des props via le rune $props()
	let {
		accept = [],
		multiple = false,
		label = 'Déposez vos fichiers ici',
		mini = false,
		onFiles: onfiles
	}: Props = $props();

	// 3. États locaux avec le rune $state()
	type DropStatus = 'idle' | 'dragging' | 'success' | 'error';

	let status = $state<DropStatus>('idle');
	let errorMessage = $state<string | null>(null);
	let inputElement: HTMLInputElement;

	// --- Logique de validation ---
	const validateFiles = (fileList: FileList | null): File[] => {
		if (!fileList || fileList.length === 0) return [];

		const files = Array.from(fileList);

		if (accept.length != 0) {
			const invalidFile = files.find((f) => {
				return !accept.includes('.' + f.name.split('.').pop() || '');
			});

			if (invalidFile) {
				status = 'error';
				errorMessage = `Format non supporté. Attendu : ${accept}`;
				return [];
			}
		}

		status = 'success';
		errorMessage = null;
		return files;
	};

	// --- Handlers ---
	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		if (status === 'error') status = 'idle';

		const files = validateFiles(e.dataTransfer?.files || null);

		if (files.length > 0) {
			onfiles?.(files);

			setTimeout(() => (status = 'idle'), 2000);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		status = 'dragging';
	};

	const handleDragLeave = () => {
		status = 'idle';
	};

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const files = validateFiles(target.files);
		if (files.length > 0) onfiles?.(files);
		target.value = '';
		setTimeout(() => {
			status = 'idle';
		}, 2000);
	};
</script>

<div
	class="card dropzone"
	class:status-connecting={status === 'dragging'}
	class:status-connected={status === 'success'}
	class:status-error={status === 'error'}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={() => inputElement.click()}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && inputElement.click()}
>
	<input
		type="file"
		accept={accept.join(', ')}
		{multiple}
		hidden
		bind:this={inputElement}
		onchange={handleInput}
	/>

	<div class="content">
		{#if status === 'error'}
			<span class="icon"><TriangleAlert /></span>
			{#if !mini}
				<p>{errorMessage}</p>
			{/if}
		{:else if status === 'success'}
			<span class="icon"><Check /></span>
			{#if !mini}
				<p>Fichiers reçus !</p>
			{/if}
		{:else}
			<span class="icon"><Folder /></span>
			{#if !mini}
				<p>{label}</p>

				{#if accept.length != 0}
					<small class="formats">Formats acceptés {accept.join(' ')}</small>
				{/if}
			{/if}
		{/if}
	</div>
</div>

<style>
	.dropzone {
		border: 2px dashed #ccc;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}
	.dropzone.status-connecting {
		transform: scale(1.02);
	}
	.content {
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	.icon {
		font-size: 2rem;
	}
	.formats {
		opacity: 0.6;
		font-size: 0.8em;
	}
</style>
