<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(),
		label,
		id,
		type = 'text',
		class: className,
		...rest
	}: HTMLInputAttributes & {
		value?: string | number;
		label?: string;
	} = $props();
</script>

<div class="form-group {className}">
	{#if label}
		<label for={id}>
			{label}
		</label>
	{/if}
	
	<input
		{id}
		{type}
		bind:value
		{...rest}
	/>
</div>

<style>
	.form-group {
		margin-bottom: 1rem;
		width: 100%;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	input {
		width: 100%;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid var(--surface-border);
		color: var(--text-primary);
		padding: 0.75rem;
		border-radius: var(--radius-sm);
		box-sizing: border-box;
		font-family: var(--font-body, sans-serif);
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--accent-primary);
	}
	
	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>