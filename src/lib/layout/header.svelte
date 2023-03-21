<script lang="ts">
	import type { smallEntry } from "$lib/entry"
	import Icon from "./icon.svelte"
	import LightDark from "./lightdark.svelte"
	import Search from "./search.svelte"

	export let allEntries: smallEntry[]
	export let theme: string | undefined
</script>


<div class="head">

	<div class="layout left">
		<Icon />
	</div>

	<div class="layout mid">
		<Search {allEntries} />
	</div>

	<div class="layout right">
		<LightDark init={theme} />
	</div>

</div>


<style>
	.head {
		background-color: var(--header-background);
		display: flex;

		flex-wrap: nowrap;
		height: var(--header-height);
		box-sizing: border-box;
		padding: 0.5rem;

		margin-bottom: 0.8rem;
	}

	.layout {
		display: flex;

		padding: 0 0.5em;

		margin-inline: auto;
		align-items: center;
		justify-content: center;
	}

	.layout.mid {
		-webkit-box-flex: 1;
		flex-grow: 1;
		flex-shrink: 1;
	}
</style>
