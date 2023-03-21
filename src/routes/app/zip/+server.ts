import { cache } from "$lib/entry"
import { json } from "@sveltejs/kit"
import zlib from "node:zlib"

export async function GET () {
	const allMeta = await cache.get()
	const zip = zlib.gzipSync(JSON.stringify(allMeta))

	return json([ ...zip ])
}
