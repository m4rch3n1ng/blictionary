import { cache } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"
import zlib from "node:zlib"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	const allMeta = await cache.get()
	const zip = zlib.gzipSync(JSON.stringify(allMeta))

	return {
		// filter allMeta for useful ones only
		allMeta: allMeta.slice(0, 1),
		zip: [ ...zip ],
		theme: cookies.get("theme")
	}
}
