<script lang="ts">
	import { CONNECTION_STATUS, type ConnectionStatus } from '$lib/types/connection-status';

	const { status }: { status: ConnectionStatus } = $props();
</script>

<p class={status.toLowerCase()}>{CONNECTION_STATUS[status]}</p>

<style>
	p,
	.disconnected {
		color: var(--text-muted);
		font-family: var(--font-body);
		font-weight: 700;
	}

	.connected {
		color: var(--accent-success);
	}

	.connecting,
	.reconnecting {
		color: var(--accent-warning);
	}

	.error {
		color: var(--accent-danger);
	}
</style>
