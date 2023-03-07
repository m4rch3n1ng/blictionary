import { filter as fuzzyFilter, sort as fuzzySort } from "fuzzyjs"
import { writable } from "svelte/store"
import type { smallMeta } from "./entry"

export const items = writable<smallMeta[]>([])

export function initSearch ( allMeta: smallMeta[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const it = filterSearch(value)
			items.set(it)
		}
	}

	function filterSearch ( value: string ) {
		const filtered = allMeta.filter(fuzzyFilter(value, { iterator: ({ word }) => word }))
		const sorted = filtered.sort(fuzzySort(value, { iterator: ({ word }) => word }))

		return sorted
	}
}
