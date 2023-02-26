<script lang="ts">
	import type { PageData } from "./$types"
	import Header from "$lib/layout/header.svelte"
	import "../app.css"

	export let data: PageData
</script>


<Header theme={data.theme} allMeta={data.allMeta} />

<slot />
