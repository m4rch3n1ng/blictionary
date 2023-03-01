<script lang="ts">
	import type { Entry } from "$lib/entry"
	import Definition from "./definition.svelte"

	export let definitions: Entry["definitions"]
</script>


{#each definitions as definition, i}
	{#if "sub" in definition}
		<Definition {definition} {i} />
		{#each definition.sub as subDef, j}
			<Definition definition={subDef} i={j} letter={true} />
		{/each}
	{:else}
		<Definition {definition} {i} />
	{/if}
{/each}
