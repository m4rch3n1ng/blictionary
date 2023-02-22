import { filter as fuzzyFilter, sort as fuzzySort } from "fuzzyjs"
import { writable } from "svelte/store"
import type { smallMeta } from "./entry"

// export let items: smallMeta[] = []
export const items = writable<smallMeta[]>([])

export function initSearch ( allMeta: smallMeta[] ) {
	return function search ( ev: Event & { currentTarget: EventTarget & HTMLInputElement } ) {
		const input = ev.currentTarget
		if (!input.value.length) {
			items.set([])
		} else {
			const it = filterSearch(input)
			items.set(it)
		}
	}

	function filterSearch ( input: HTMLInputElement ) {
		const filtered = allMeta.filter(fuzzyFilter(input.value, { iterator: ({ word }) => word }))
		const sorted = filtered.sort(fuzzySort(input.value, { iterator: ({ word }) => word }))

		return sorted
	}
}
