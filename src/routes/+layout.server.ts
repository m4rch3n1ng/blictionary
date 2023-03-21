import { cache } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	const allEntries = await cache.get()

	return {
		// filter allEntries for useful ones only
		allEntries: allEntries.slice(0, 1),
		theme: cookies.get("theme")
	}
}
