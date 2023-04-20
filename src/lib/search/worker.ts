import type { smallEntry } from "$lib/entry"
import { expose } from "comlink"
import { fuzzy } from "./fuzzy"

let allEntries: smallEntry[]
function init ( newEntries: smallEntry[] ) {
	allEntries = newEntries
}

function search ( value: string ) {
	const sorted = fuzzy<smallEntry>(value, allEntries)
	return sorted.slice(0, 10)
}

export interface worker {
	init: typeof init,
	search: typeof search
}

expose(<worker>{ init, search })
