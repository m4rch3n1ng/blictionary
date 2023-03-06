<script lang="ts">
	import type { PageData } from "./$types"
	import { initMark, wordClassToString, inlineMarkdown } from "$lib/markdown"
	import Definitions from "$lib/view/definitions.svelte"
    import Wrap from "$lib/view/wrap.svelte"
    import MultiText from "$lib/view/multitext.svelte"
    import SubEntry from "$lib/view/subentry.svelte"

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

		{#if entry.forms}
			<div class="view-item">
				<span class="h">Forms:</span>
				<MultiText text={entry.forms} />
			</div>
		{/if}

		<div class="view-item">
			<span class="h">Etymology:</span>
			<MultiText text={entry.etymology} />
		</div>

		<div class="view-item">
			<Definitions definitions={entry.definitions} />
		</div>

		{#if entry.sub && entry.sub.length > 0}
			<div class="view-item">
				<div class="h compound">Compounds</div>
				{#each entry.sub as sub}
					<SubEntry {sub} />
				{/each}
			</div>
		{/if}
	
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

	.compound {
		font-size: var(--font-size-l);
		padding-top: 30px;
		font-variant: small-caps;
	}
</style>
