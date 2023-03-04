<script lang="ts">
    import { inlineMarkdown } from "$lib/markdown";

	export let text: string | string[]
</script>


<!-- todo wait i think i can do this like inline? -->

{#if Array.isArray(text)}
	{#each text as t}
		<p>{@html inlineMarkdown(t)}</p>
	{/each}
{:else}
	{@html inlineMarkdown(text)}
{/if}
