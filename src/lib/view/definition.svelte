<script lang="ts">
	import type { Entry } from "$lib/entry"
	import { markdown } from "$lib/markdown"

	export let definition: Entry["definitions"][0]
	export let i: number
	export let letter: boolean = false
	import Quotes from "./quote.svelte"

	const alph = "abcdefghijklmnopqrstuvw"
	const ind: string | number = !letter ? i + 1 : alph[i]!
</script>


<div class="def">
	<span class="text">
		<strong>{ind}.</strong> {#if definition.text}{@html markdown(definition.text)}{/if}
	</span>
	<Quotes quotes={definition.quotes} />
</div>


<style>
	.def {
		padding-top: 10px;
	}

	.text {
		font-size: var(--font-size-l);
	}
</style>
