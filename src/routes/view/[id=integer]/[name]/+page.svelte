<script lang="ts">
	import type { PageData } from "./$types"
	import { initMark, wordClassToString, inlineMarkdown } from "$lib/markdown"
	import Definitions from "$lib/view/definitions.svelte"
    import Wrap from "$lib/view/wrap.svelte"
    import Multitext from "$lib/view/multitext.svelte"

	export let data: PageData
	$: entry = data.entry

	initMark(data.allMeta)
</script>


<svelte:head>
	<title>{entry.word}, {wordClassToString(entry.class, false)} | blictionary</title>
</svelte:head>

{#key entry}
	<Wrap>

		<h1>
			{entry.word},
			{@html wordClassToString(entry.class, true)}
		</h1>

		<div class="view-item">
			<span class="h">Pronounciation:</span>
			<span>
				R.P. <code class="IPA">{entry.pronounciation.rp}</code>,
				U.S. <code class="IPA">{entry.pronounciation.us}</code>
				{#if entry.pronounciation.note}
					{@html inlineMarkdown(entry.pronounciation.note)}
				{/if}
			</span>
		</div>

		<div class="view-item">
			{#if entry.forms}
				<span class="h">Forms:</span>
				<Multitext text={entry.forms} />
			{/if}
		</div>

		<div class="view-item">
			<span class="h">Etymology:</span>
			<Multitext text={entry.etymology} />
		</div>

		<Definitions definitions={entry.definitions} />
	
	</Wrap>
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
</style>
