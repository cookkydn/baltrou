<script lang="ts">
	import type { Player } from '$lib/types/activities/players';
	import FileDropzone from '$lib/ui/FileDropzone.svelte';
	import { Save, X, Trophy, User, Minus, Plus } from '@lucide/svelte';

	interface Props {
		player: Player;
		onUpdateName?: (id: string, newName: string) => void;
		onUpdateScore?: (id: string, newScore: number) => void;
		onUpdatePicture?: (id: string, file: File) => void;
		onDelete?: (id: string) => void;
	}

	let { player, onUpdateName, onUpdateScore, onUpdatePicture, onDelete }: Props = $props();

	let isEditingName = $state(false);
	let editName = $state(player.name);
	// let editNameInput: HTMLInputElement | null = $state(null);
	let currentPicture = $derived(player.profilePictureUrl);

	function handleSaveName() {
		if (editName.trim() && editName !== player.name) {
			onUpdateName?.(player.id, editName);
		}
		isEditingName = false;
	}

	function handleCancelName() {
		editName = player.name;
		isEditingName = false;
	}

	function handleFileSelect(files: File[]) {
		if (files.length > 0) {
			onUpdatePicture?.(player.id, files[0]);
		}
	}

	function adjustScore(delta: number) {
		onUpdateScore?.(player.id, player.score + delta);
	}
</script>

<div class="card player-card">
	<div
		class="delete-btn"
		onclick={() => onDelete?.(player.id)}
		role="button"
		tabindex="0"
		onkeydown={() => {}}
	>
		<X />
	</div>
	<div class="card-header">
		<div class="profile-section">
			<div class="avatar-container">
				{#if currentPicture}
					<img src={currentPicture} alt={player.name} class="avatar-img" />
				{:else}
					<User size="50%" />
				{/if}
			</div>
			<div class="upload-overlay">
				<FileDropzone
					accept={['.jpg', '.png', '.webp', '.heic']}
					label="Changer l'image"
					onFiles={handleFileSelect}
				/>
			</div>
		</div>
		<div class="player-info">
			<div class="name-container">
				{#if isEditingName}
					<!-- <input
						type="text"
						class="edit-input"
						bind:value={editName}
						bind:this={editNameInput}
						onkeydown={(e) => e.key === 'Enter' && handleSaveName()}
						onblur={handleSaveName}
					/> -->
					<div class="edit-actions">
						<button class="icon-btn success" onclick={handleSaveName}><Save size={16} /></button>
						<button class="icon-btn danger" onclick={handleCancelName}><X size={16} /></button>
					</div>
				{:else}
					<h3 class="player-name">{player.name}</h3>
					<!-- Removed, I will support name editing later -->
					<!-- <button
						class="icon-btn edit"
						onclick={() => {
							isEditingName = true;
							editNameInput?.focus();
						}}
					>
						<Pencil size={14} />
					</button> -->
				{/if}
			</div>
			<span class="id-badge">ID: {player.id.substring(0, 8)}</span>
		</div>
	</div>

	<div class="score-section">
		<div class="score-display">
			<Trophy class="score-icon" size={20} />
			<span class="score-value">{player.score}</span>
		</div>
		<div class="score-controls">
			<button class="btn btn-sm" onclick={() => adjustScore(-1)}><Minus /></button>
			<button class="btn btn-sm btn-success" onclick={() => adjustScore(1)}><Plus /></button>
		</div>
	</div>
</div>

<style>
	.player-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 300px;
		transition:
			transform 0.2s ease,
			background-color 0.2s ease;
		padding: 1rem 1.25rem;
		position: relative;
		background-color: var(--surface-color);
		border: 1px solid var(--surface-border);
		border-radius: var(--radius-md);
		backdrop-filter: blur(10px);
		margin: 0;
	}

	.player-card:hover {
		background-color: var(--surface-hover);
		transform: translateY(-4px);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.profile-section {
		position: relative;
		width: 60px;
		height: 60px;
		border-radius: var(--radius-full);
		overflow: hidden;
		border: 2px solid var(--accent-primary);
		flex-shrink: 0;
	}

	.profile-section .avatar-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.upload-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.3s ease;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-section:hover .upload-overlay {
		opacity: 1;
	}

	.player-info {
		text-align: left;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.name-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.1rem;
	}

	.player-name {
		margin: 0;
		font-size: 1.25rem;
		color: var(--text-primary);
		font-family: var(--font-heading);
	}

	.id-badge {
		font-family: monospace;
		font-size: 0.7rem;
		color: var(--text-muted);
	}

	.score-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		background: rgba(0, 0, 0, 0.2);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
		box-sizing: border-box;
	}

	.score-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.score-value {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		color: var(--text-primary);
	}

	.score-controls {
		display: flex;
		gap: 0.4rem;
	}

	.btn-sm {
		padding: 0.2rem 0.5rem;
		font-size: 0.75rem;
	}

	.icon-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-secondary);
		display: flex;
		padding: 2px;
		border-radius: var(--radius-sm);
		transition: background 0.2s;
	}

	/* .edit-input {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--accent-info);
		color: white;
		border-radius: 4px;
		padding: 2px 6px;
		font-family: var(--font-body);
		font-size: 1rem;
		width: 120px;
	} */

	.delete-btn {
		position: absolute;
		top: 8px;
		right: 8px;
		color: var(--text-muted);
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.delete-btn:hover {
		color: var(--accent-danger);
	}
</style>
