import { wrap } from "comlink"
import { writable } from "svelte/store"
import { browser } from "$app/environment"
import type { smallEntry } from "$lib/entry"
import type { worker } from "./worker"

export const items = writable<smallEntry[]>([])
export let search: ( val: string ) => Promise<void>

export async function initSearch ( allEntries: smallEntry[] ) {
	if (!browser) return

	const fuzzyWorker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
	const fuzzy = wrap<worker>(fuzzyWorker)

	search = async function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const sortEntries = await fuzzy.search(value)
			items.set(sortEntries)
		}
	}

	await fuzzy.init(allEntries)
}

// todo ungzip fetch etc
