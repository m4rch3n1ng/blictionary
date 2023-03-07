<script lang="ts">
	import { get } from "svelte/store"
	import { afterNavigate, goto } from "$app/navigation"
	import { page } from "$app/stores"
	import type { smallMeta } from "$lib/entry"
	import { initSearch, items } from "$lib/search"
	import SearchItem from "./search-item.svelte"

	export let allMeta: smallMeta[]
	const search = initSearch(allMeta)

	let value = get(page).url.searchParams.get("q") || ""
	search(value)

	let focus = false
	function focusIn () {
		focus = true
	}

	afterNavigate(( afterNav ) => {
		focus = false
		value = afterNav.to?.url.searchParams.get("q") || ""
		search(value)
	})

	let searchContainer: HTMLElement
	function click ( ev: ( MouseEvent | FocusEvent ) & { currentTarget: EventTarget & HTMLElement } ) {
		if (!focus) return

		const isChild = searchContainer.contains(ev.target as Node)
		focus = isChild
	}

	function keydown ( ev: KeyboardEvent ) {
		if (/enter/i.test(ev.key)) {
			ev.preventDefault()
			if ($items[0]) {
				const item = $items[0]
				goto(`/view/${item.id}/${item.word}`)		
			}
		} else if (ev.key === "ArrowDown") {
			// todo handle error down
		} else if (ev.key === "ArrowUp") {
			// todo handle error up
		}
	}
</script>


<svelte:body on:click={click} on:focusin={click} />

<div class="wrap">
	<div class="inner">
		<div bind:this={searchContainer} id="search-container">
			<div class="input-container">
				<form action="/search" class="input-layout">

					<input bind:value on:input={( ev ) => search(ev.currentTarget.value)} on:focus={focusIn} on:focusin={focusIn} on:keydown={keydown}
						type="search"
						name="q"
						id="search-input"
						placeholder="search"
						aria-label="search"
						aria-haspopup="grid"
						aria-owns="dropdown-container"
						aria-controls="dropdown-container"
						autocapitalize="off"
						autocorrect="off"
						autocomplete="off"
						spellcheck="false"
					/>

				</form>

				<div id="search-result" class="dropdown-container {focus && value && $items.length ? "active" : "inactive"}">
					<div class="dropdown {focus && value && $items.length ? "active" : "inactive"}">
						{#each $items as { id, word, class: wordClass }}
							<SearchItem {id} {word} {wordClass} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<style>
	.wrap {
		position: relative;

		max-width: var(--search-input-max-size);
		width: 100%;
		
		border: 0;
		padding: 0;
	}

	.inner {
		height: inherit;

		display: flex;
		align-items: center;
	}
	
	#search-container {
		width: 100%;
	}

	.input-layout {
		padding: 5px;
	}
	
	#search-result {
		padding-top: var(--header-item-height);

		z-index: -1;
	}

	#search-input {
		display: block;

		width: 100%;
		height: var(--header-item-height);

		appearance: none;
		background-clip: padding-box;

		line-height: 1.5;
		transition: border 100ms ease-in,background-color 100ms ease-in;

		border-style: solid;
		border-width: 2px;
		border-color: var(--search-input-background);
		border-radius: 6px;

		color: var(--search-input-text-color);

		background-color: var(--search-input-background);
	
    	padding: 0 0.5rem 0 1rem !important;
	}

	#search-input:focus, #search-input:focus:hover {
		outline: none;
		border-color: var(--search-input-focus-border);
		background-color: var(--search-input-focus-background);
	}

	.input-container {
		position: relative;
		z-index: 100;
	}

	.dropdown-container {
		top: 0;
		position: absolute;
		padding: 5px;
		z-index: 50;
		border-radius: 6px;
		width: 100%;
		border: 0;
	}

	.dropdown-container.active {
		background-color: var(--search-container-background);
		box-shadow: 0 6px 16px rgba(0,0,0,.16),0 0px 4px rgba(0,0,0,.05);
	}

	.dropdown {
		/* height: 100px; */
		/* padding-top: 5px; */
		/* background-color: #0e0e10; */
		margin-top: 10px;
		display: none;
		max-width: var(--search-input-max-size);
	}

	.dropdown.active {
		display: block;
	}
</style>
