import { writable } from "svelte/store"
import type { smallEntry } from "./entry"

export const items = writable<smallEntry[]>([])

export function initSearch ( allEntries: smallEntry[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			items.set(allEntries)
		}
	}
}
