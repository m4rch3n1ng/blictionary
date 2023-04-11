<script lang="ts">
	import { wordClassToString } from "$lib/markdown"
    import Wrap from "$lib/view/wrap.svelte"

	export let data
</script>


<svelte:head>
	<title>search results | blictionary</title>
</svelte:head>

<!-- todo preview? -->

<Wrap>
	<div class="h">search results</div>
	<div>showing {data.search.length} entries </div>

	<div class="grid">
		{#each data.search as { id, word, class: wordClass }}
		<a href="/view/{id}/{word}" class="link">

			<div class="id">{id}</div>
			<div class="word">
				<p>
					{word},
					{@html wordClassToString(wordClass, true)}
				</p>
			</div>

		</a>
		{/each}
	</div>
</Wrap>

<style>
	.h {
		font-size: var(--font-size-h);
		color: var(--h-color)
	}

	.grid {
		display: grid;
		/* row-gap: 1px; */
		margin-top: 10px;
	}

	.link {
		height: 35px;
		display: flex;
		padding: 0 10px 0 5px;
		align-items: center;
		color: var(--text-color);
		text-decoration: none;
	}

	.id {
		width: 30px;
		text-align: right;
		margin-right: 10px;
		flex-shrink: 0;
	}

	.word {
		text-overflow: ellipsis;
		overflow: hidden;
		flex-grow: 1;
		display: flex;
		white-space: nowrap;
	}

	.word > p {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.link:hover, .link:focus {
		background-color: var(--search-input-focus-border);
	}
</style>
