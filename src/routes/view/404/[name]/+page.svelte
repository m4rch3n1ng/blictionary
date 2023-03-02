<script lang="ts">
	import type { PageData } from "./$types"
	import Wrap from "$lib/view/wrap.svelte"

	export let data: PageData
</script>


<svelte:head>
	<title>404 {data.word} | blictionary</title>
</svelte:head>

{#key data.word}
	<Wrap>

		<h1>
			{data.word}
		</h1>

		<div class="view-item">
			<p>this page does not exist on the blictionary</p>
		</div>

	</Wrap>
{/key}


<style>
	h1 {
		color: var(--view-title-text-color); 
		font-size: var(--font-size-h);
		margin-bottom: 20px;
	}
</style>
