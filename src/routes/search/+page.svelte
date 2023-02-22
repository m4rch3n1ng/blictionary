<script lang="ts">
	import type { PageData } from "../../routes/search/$types"

	export let data: PageData
</script>


<!-- todo make look good -->
{#each data.allMeta as { id, word }}
	<a href="/view/{id}/{word}">{id} {word}</a>
{/each}


<style>
	a {
		display: block;
	}
</style>
