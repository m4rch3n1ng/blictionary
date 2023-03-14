import type { smallMeta } from "$lib/entry"
import { expose } from "comlink"
import { fuzzy } from "./fuzzy"

let allMeta: smallMeta[]
function init ( newMeta: smallMeta[] ) {
	allMeta = newMeta
}

function search ( value: string ) {
	const sorted = fuzzy(value, allMeta)
	return sorted.slice(0, 10)
}

export interface worker {
	init: typeof init,
	search: typeof search
}

expose(<worker>{ init, search })
