<script>
	import { page } from "$app/state";
	import { PUBLIC_TWITCH_CLIENT_ID, PUBLIC_TWITCH_SCOPE } from "$env/static/public";
	import { onMount } from "svelte";

    let twitchOauthUrl="";
    
    onMount(()=> {
        const url = new URL("https://id.twitch.tv/oauth2/authorize");
        url.searchParams.set("client_id",PUBLIC_TWITCH_CLIENT_ID);
        url.searchParams.set("response_type","code");
        url.searchParams.set("scope",PUBLIC_TWITCH_SCOPE);
        url.searchParams.set("force_verify","true");
        url.searchParams.set("redirect_uri",`${page.url.origin}/api/auth/callback`);
        twitchOauthUrl = url.toString();
    
    })
</script>
<div class="content-box">
	<h1>Connexion</h1>
	<a href={twitchOauthUrl.toString()} class="twitch-connect-button">Connexion à Twitch</a>
</div>

<style>
	.twitch-connect-button {
		display: inline-block;
		background-color: #9146ff; /* Twitch purple */
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-size: 1rem;
		text-align: center;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.twitch-connect-button:hover {
		background-color: #7a3de0;
	}
</style>
