<script lang="ts">
	import type { smallMeta } from "$lib/entry"
	import { afterNavigate, goto } from "$app/navigation"
	import SearchItem from "./search-item.svelte"
	import { initSearch, items } from "$lib/search"

	export let allMeta: smallMeta[]
	const search = initSearch(allMeta)

	let value = ""
	let focus = false
	function focusIn () {
		focus = true
	}

	afterNavigate(() => {
		focus = false
		value = ""
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
		<div bind:this={searchContainer} id="search-container" class="search-container">

			<div class="input-container">
				<form action="/search" class="input-layout">

					<input bind:value on:input={search} on:focus={focusIn} on:focusin={focusIn} on:keydown={keydown}
						type="search"
						name="q"
						class="input font-mono"
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
			</div>

			<div id="dropdown-container" class="dropdown-container {focus && value && $items.length ? "active" : "inactive"}">

				<div class="dropdown-offset">
					<input class="input" />
				</div>

				<div class="dropdown {focus && value && $items.length ? "active" : "inactive"}">
					{#each $items as { id, word, class: wordClass }}
						<SearchItem {id} {word} {wordClass} />
					{/each}
				</div>

			</div>

		</div>
	</div>
</div>


<style>
	.wrap {
		flex-basis: var(--search-input-max-size);
		
		position: relative;

		max-width: var(--search-input-max-size);
		height: var(--header-height);
		width: 100%;
		
		border: 0;

		padding: 2px 0;
	}

	.inner {
		height: inherit;

		display: flex;
		align-items: center;
	}

	.search-container {
		width: 100%;
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

	.input {
		display: block;
		width: 100%;
		height: 36px;
		appearance: none;
		background-clip: padding-box;
		line-height: 1.5;
		transition: border 100ms ease-in,background-color 100ms ease-in;
		border-style: solid;
		border-width: 2px;
		border-color: var(--search-input-background);
		color: var(--search-input-text-color);
		background-color: var(--search-input-background);
		border-radius: 0.6rem;
    	padding: 0.5rem 1rem !important;
	}

	.input:focus, .input:focus:hover {
		outline: none;
		border-color: var(--search-input-focus-border);
		background-color: var(--search-input-focus-background);
	}

	.dropdown-offset {
		visibility: hidden;
		position: relative;
	}

	.dropdown {
		/* height: 100px; */
		padding-top: 5px;
		/* background-color: #0e0e10; */
		display: none;
		max-width: var(--search-input-max-size);
	}

	.dropdown.active {
		display: block;
	}
</style>
