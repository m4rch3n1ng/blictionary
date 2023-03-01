<script lang="ts">
	import { wordClassToString } from "$lib/markdown"
	import type { PageData } from "../../routes/search/$types"

	export let data: PageData
</script>


<svelte:head>
	<title>search results | blictionary</title>
</svelte:head>

<!-- todo preview? -->

<div class="main">
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
</div>

<style>
	.h {
		font-size: var(--font-size-h);
		color: var(--h-color)
	}

	.grid {
		display: grid;
		row-gap: 1px;
		margin-top: 10px;
	}

	.link {
		background-color: white;
		display: block;
	}

	.main {
		margin-right: 80px;
		margin-left: 80px;
		width: auto;
	}

	@media (max-width: 1000px) {
		.main {
			margin: 0 1rem;
		}
	}

	@media (min-width: 1600px) {
		.main {
			position: static;
			width: 1440px;
			margin-right: auto;
			margin-left: auto;
		}
	}

	/* .link {
		height: 35px;
		display: flex;
		align-items: center;
		padding: 0 10px 0 5px;
		color: var(--text-color);
		text-decoration: none;
	}

	.main:hover, .main:focus {
		background: var(--search-item-focus-background);
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
	} */
</style>
