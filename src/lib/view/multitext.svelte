<script lang="ts">
    import { inlineMarkdown } from "$lib/markdown"

	export let text: string | string[]
</script>


<div class="main">
	{#if Array.isArray(text)}
		{#each text as t}
			<p>{@html inlineMarkdown(t)}</p>
		{/each}
	{:else}
		<p>{@html inlineMarkdown(text)}</p>
	{/if}
</div>


<style>
	.main {
		display: inline;
	}

	.main > p:first-child {
		display: inline;
	}
</style>
