<script lang="ts">
	import type { smallMeta } from "$lib/entry"
	import Icon from "./icon.svelte";
    import LightDark from "./lightdark.svelte";
	import Search from "./search.svelte"

	export let allMeta: smallMeta[]
	export let theme: string | undefined
</script>


<div class="head">

	<div class="layout left">
		<Icon />
	</div>

	<div class="layout mid">
		<Search {allMeta} />
	</div>

	<div class="layout right">
		<LightDark init={theme} />
	</div>

</div>


<style>
	.head {
		background-color: var(--header-background);
		height: fit-content;
		display: flex;
		align-items: stretch;
		flex-wrap: wrap;

		margin-bottom: 0.5em;
	}

	.layout {
		display: flex;
		-webkit-box-flex: 2;
		flex-grow: 2;
		flex-shrink: 1;

		padding: 0.5em;
	}

	.layout.mid {
		justify-content: center;
	}

	.layout.left {
		justify-content: center;

		flex-direction: column;
		width: fit-content;
	}

	.layout.right {
		display: none;
	}
</style>
