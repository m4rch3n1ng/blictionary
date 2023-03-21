import { cache } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"
import zlib from "node:zlib"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	const allEntries = await cache.get()
	const zip = zlib.gzipSync(JSON.stringify(allEntries))

	return {
		// filter allEntries for useful ones only
		allEntries: allEntries.slice(0, 1),
		zip: [ ...zip ],
		theme: cookies.get("theme")
	}
}
