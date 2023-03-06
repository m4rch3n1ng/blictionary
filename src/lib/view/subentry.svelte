<script lang="ts">
    import type { SubEntry } from "$lib/entry"
    import { inlineMarkdown, wordClassToString } from "$lib/markdown"
    import Quotes from "./quotes.svelte"

	export let sub: SubEntry
</script>


<div class="sub">
	<span class="text">
		<strong>{sub.word}</strong>
		{@html wordClassToString(sub.class, true)}
		{@html inlineMarkdown(sub.definition)}
	</span>
	<Quotes quotes={sub.quotes} />
</div>


<style>
	.sub {
		font-size: var(--font-size-l);
		padding-top: 10px;
	}
</style>

