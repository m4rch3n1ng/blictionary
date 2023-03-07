<script lang="ts">
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import { initTheme, invertTheme } from "$lib/theme"
	import Moon from "$lib/assets/moon.svg.svelte"
	import Sun from "$lib/assets/sun.svg.svelte"

	onMount(() => {
		const matchMedia = window.matchMedia("(prefers-color-scheme: dark)")
		if (!init) theme.set(matchMedia.matches ? "dark" : "light", false)
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ( ev ) => {
			const isCookie = theme.cookie()
			if (!isCookie) theme.set(ev.matches ? "dark" : "light", false)
		})
	})

	export let init: string | undefined
	const theme = initTheme(init)

	let btn: HTMLButtonElement
	function submit () {
		btn.blur()
		theme.invert($theme)
	}
</script>


<!-- todo auto theme (dropdown?) -->
<form class="wrap" action="/app/theme" on:submit|preventDefault={submit} >
	<button bind:this={btn} type="submit">
		<div class="dark {$theme ? $theme === "dark" : ""}">
			<Moon />
		</div>
		<div class="light {$theme ? $theme === "light" : ""}">
			<Sun />
		</div>
	</button>
	<input type="text" name="theme" value={invertTheme(init)} />
	<input type="text" name="url" value={$page.url.href} />
</form>


<style>
	.wrap {
		display: flex;
		align-items: center;
	}

	input {
		display: none;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		height: var(--header-item-height);
		width: var(--header-item-height);

		color: var(--text-color);
	}

	button:hover, button:focus {
		background-color: var(--svg-focus-background);
		border-radius: 6px;
		transition: background-color 0.2s ease;
	}

	.dark, .light {
		display: inline-block;
		height: var(--header-svg-height);
		width: var(--header-svg-height);
	}

	.dark {
		display: none;
	}

	@media screen and (prefers-color-scheme: dark) {
		.dark {
			display: inline-block;
		}

		.light {
			display: none;
		}
	}

	.light.false, .dark.false {
		display: none
	}

	.light.true, .dark.true {
		display: inline-block;
	}
</style>
