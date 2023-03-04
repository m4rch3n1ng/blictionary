import { writable } from "svelte/store"
import type { smallMeta } from "./entry"

export const items = writable<smallMeta[]>([])

export function initSearch ( allMeta: smallMeta[] ) {
	return function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			items.set(allMeta)
		}
	}
}
