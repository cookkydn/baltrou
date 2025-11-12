<script lang="ts">
	import { auth } from '$lib/stores/auth-store';
	import { stream } from '$lib/stores/stream-store';
</script>

<div class="content-box">
	<h1>Welcome to B.A.L.T.R.O.U.</h1>
	<p>Broadcast Asset Live Tool for Real-time Overlay Utility</p>
	<p>C'est marrant et ça c'est drôle</p>
</div>

<div class="content-box debug">
	<h2>Debug infos</h2>
	<p>loggedIn: {$auth.loggedIn}</p>
	<p>stream: {JSON.stringify($stream,null,2)}</p>
</div>

<style>
	.debug {
		font-family: monospace;
	}
</style>
