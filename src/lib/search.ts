import { filter as fuzzyFilter, sort as fuzzySort } from "fuzzyjs"
import { writable } from "svelte/store"
import type { smallEntry } from "./entry"

export const items = writable<smallEntry[]>([])

export function initSearch ( allEntries: smallEntry[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const it = filterSearch(value)
			items.set(it)
		}
	}

	function filterSearch ( value: string ) {
		const filtered = allEntries.filter(fuzzyFilter(value, { iterator: ({ word }) => word }))
		const sorted = filtered.sort(fuzzySort(value, { iterator: ({ word }) => word }))

		return sorted
	}
}
