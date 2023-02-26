<script lang="ts">
	import { onMount } from "svelte"
	import { page } from "$app/stores"
    import { initTheme, invertTheme } from "$lib/theme"
	import Moon from "$lib/assets/moon.svg.svelte"
	import Sun from "$lib/assets/sun.svg.svelte"

	export let init: string | undefined
	const theme = initTheme(init)

	onMount(() => {
		const matchMedia = window.matchMedia("(prefers-color-scheme: dark)")
		if (!init) theme.set(matchMedia.matches ? "dark" : "light", false)

		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ( ev ) => {
			const isCookie = theme.cookie()
			if (!isCookie) theme.set(ev.matches ? "dark" : "light", false)
		})
	})

	let btn: HTMLButtonElement
	function submit () {
		btn.blur()
		theme.invert($theme)
	}
</script>


<!-- todo auto theme (dropdown?) -->
<form action="/app/theme" on:submit|preventDefault={submit} >
	<button bind:this={btn} type="submit">
		{#if $theme === "dark"}
			<Moon />
		{:else}
			<Sun />
		{/if}
	</button>
	<input type="text" name="theme" value={invertTheme(init)} />
	<input type="text" name="url" value={$page.url.pathname} />
</form>


<style>
	input {
		display: none;
	}

	button {
		display: block;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		height: var(--header-item-height);
		width: var(--header-item-height);
		margin: 0 5px;
	}

	button:hover, button:focus {
		background-color: var(--svg-focus-background);
		border-radius: 6px;
		transition: background-color 0.2s ease;
	}
</style>
