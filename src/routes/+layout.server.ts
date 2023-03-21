import { cache } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	const allMeta = await cache.get()

	return {
		// filter allMeta for useful ones only
		allMeta: allMeta.slice(0, 1),
		theme: cookies.get("theme")
	}
}
