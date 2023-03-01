<script lang="ts">
	import type { PageData } from "./$types"
	import { initMark, wordClassToString, markdown } from "$lib/markdown"
	import Definitions from "./definitions.svelte"
	import "./item.css"

	export let data: PageData
	$: entry = data.entry

	initMark(data.allMeta)
</script>

<svelte:head>
	<title>{entry.word}, {wordClassToString(entry.class, false)} | blictionary</title>
</svelte:head>

{#key entry}
	<div class="main">

		<h1>
			{entry.word},
			{@html wordClassToString(entry.class, true)}
		</h1>

		<div class="item">
			<span class="h">Pronounciation:</span>
			<span>
				R.P. <code class="IPA">{entry.pronounciation.rp}</code>,
				U.S. <code class="IPA">{entry.pronounciation.us}</code>
				{#if entry.pronounciation.note}
					{@html markdown(entry.pronounciation.note)}
				{/if}
			</span>
		</div>

		<!-- todo forms -->
		<div class="item">
			{#if entry.forms}
				<span class="h">Forms:</span>
				<span>{@html markdown(entry.forms)}</span>
			{/if}
		</div>

		<div class="item">
			<span class="h">Etymology:</span>
			{@html markdown(entry.etymology, false)}
		</div>

		<Definitions definitions={entry.definitions} />

	</div>
{/key}

<style>
	h1 {
		color: var(--view-title-text-color); 
		font-size: var(--font-size-h);
		margin-bottom: 20px;
	}

	.h {
		font-weight: 700;
		margin-right: 2px;
	}

	.main {
		margin-right: 80px;
		margin-left: 80px;
		width: auto;
	}

	@media (max-width: 1000px) {
		.main {
			margin: 0 1rem;
		}
	}

	@media (min-width: 1600px) {
		.main {
			position: static;
			width: 1440px;
			margin-right: auto;
			margin-left: auto;
		}
	}

	.item {
		margin-bottom: 10px;
	}
</style>
