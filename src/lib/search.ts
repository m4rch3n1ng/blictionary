import { writable } from "svelte/store"
import type { smallMeta } from "./entry"
import { fuzz } from "./fuzzy"

export const items = writable<smallMeta[]>([])

export function initSearch ( allMeta: smallMeta[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const sortMeta = fuzz(allMeta, value)
			items.set(sortMeta)
		}
	}
}
