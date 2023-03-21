import { wrap } from "comlink"
import { writable } from "svelte/store"
import { browser } from "$app/environment"
import type { smallMeta } from "$lib/entry"
import type { worker } from "./worker"

export const items = writable<smallMeta[]>([])
export let search: ( val: string ) => Promise<void> = () => Promise.resolve()

export async function initSearch ( allMeta: smallMeta[] ) {
	if (!browser) return

	const fuzzyWorker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
	const fuzzy = wrap<worker>(fuzzyWorker)

	search = async function search ( value: string ) {
		if (!value.length) {
			items.set([])
		} else {
			const sortMeta = await fuzzy.search(value)
			items.set(sortMeta)
		}
	}

	await fuzzy.init(allMeta)
}

// todo ungzip fetch etc
