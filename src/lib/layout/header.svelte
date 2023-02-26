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
		height: var(--header-height);
		display: flex;
		align-items: stretch;
		flex-wrap: nowrap;
		margin-bottom: 20px;
	}

	.layout {
		display: flex;
		-webkit-box-flex: 2;
		flex-grow: 2;
		flex-shrink: 1;
		width: 100%;
		/* display: none !important; */
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
	}

	.layout.mid {
		justify-content: center;
	}

	.layout.left {
		width: fit-content;
	}

	.layout.right {
		width: fit-content;
	}
</style>
