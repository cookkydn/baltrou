<script lang="ts">
	import { page } from '$app/state';
	import './app.css';
</script>

<div class="page-content">
	<div class="card center">
		<h1>{page.status}: {page.error?.message}</h1>
		<p>Skill issue ?</p>
	</div>
</div>
