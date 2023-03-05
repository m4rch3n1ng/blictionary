import { writable } from "svelte/store"
import type { smallEntry } from "./entry"
import { fuzz } from "./fuzzy"

export const items = writable<smallEntry[]>([])

export function initSearch ( allEntries: smallEntry[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const sortEntries = fuzz(allEntries, value)
			items.set(sortEntries)
		}
	}
}
