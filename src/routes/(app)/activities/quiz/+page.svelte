<script lang="ts">
	import FileDropzone from '$lib/ui/FileDropzone.svelte';
	import { appMode } from '$lib/stores/user-store';
	import { getApp } from '$lib/state/app.svelte';
	import { onMount } from 'svelte';
	const {activities: {quizModule}} = getApp();
	let inputUrl = $state("");
	onMount(()=> {
		quizModule.load();
	})
	async function onFiles(files: File[]) {
		for (let file of files) {
			quizModule.uploadQuiz(file);
		}
	}

	async function addQuiz(){
		quizModule.uploadQuizByURL(inputUrl);
	}
</script>

{#if $appMode == 'CONFIG'}
	<FileDropzone accept={['.json']} label="Ajouter des quiz" multiple {onFiles} />
{/if}
<input type="url" name="quizUrl" id="quizUrl" bind:value={inputUrl}>
<button title="Send" type="submit" onclick={addQuiz}>Envoyer</button>

<pre>{quizModule.quizList}</pre>