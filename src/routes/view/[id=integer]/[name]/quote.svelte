<script lang="ts">
	import type { Quote } from "$lib/entry"
	import { markdown } from "$lib/markdown"
	// import { inlineMarkdown } from "$lib/markdown"

	export let quotes: Quote[] | undefined
	
</script>


{#if quotes}
	<div class="quotes">
		{#each quotes as quote}
			<div class="quote">
				<!-- <span class="d">{new Date(quote.date)}</span> todo -->
				<span class="d">{quote.date}</span>,
				<span>'{quote.author}'</span>,
				<span>{quote.location}</span>:
				"{@html markdown(quote.text)}"
				{#if quote.note}
					<div class="note">{@html markdown(quote.note)}</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}


<style>
	.quotes {
		padding: 0 10px 2px 25px;
	}

	.quote {
		margin-top: 5px;
	}

	.note {
		padding-top: 3px;
		padding-left: 26px;
	}
</style>
