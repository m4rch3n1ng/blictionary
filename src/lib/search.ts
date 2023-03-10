import { writable } from "svelte/store"
import type { smallEntry } from "./entry"
import { fuzzy } from "./fuzzy"

export const items = writable<smallEntry[]>([])

export function initSearch ( allEntries: smallEntry[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const sortEntries = fuzzy(allEntries, value)
			items.set(sortEntries)
		}
	}
}
