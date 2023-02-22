<script lang="ts">
    import { makeClass } from "$lib/markdown"

	export let id: string
	export let word: string
	export let wordClass: string | string[]
</script>


<!-- todo hover higlight -->
<a href="/view/{id}/{word}" class="main">

	<div class="id">{id}</div>
	<div class="word">
		<p>
			{word},
			{#if Array.isArray(wordClass)}
				<!-- todo wordClass: string[] -->
				{@html makeClass(wordClass, true)}
			{:else}
				<em>{wordClass}</em>
			{/if}
		</p>
	</div>

</a>


<style>
	.main {
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
	}
</style>
