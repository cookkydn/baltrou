<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type ButtonVariant = 'default' | 'primary' | 'success' | 'danger';

	let {
		children,
		variant = 'default',
		type = 'button',
		class: className = '',
		disabled = false,
		...rest
	}: HTMLButtonAttributes & {
		children: Snippet;
		variant?: ButtonVariant;
	} = $props();

	const variantClasses: Record<ButtonVariant, string> = {
		default: '',
		primary: 'btn-primary',
		success: 'btn-success',
		danger: 'btn-danger'
	};
</script>

<button class="btn {variantClasses[variant]} {className}" {type} {disabled} {...rest}>
	{@render children()}
</button>

<style>
	button {
		gap: 0.5rem;
    padding: 0.8rem 1rem;
	}
</style>
