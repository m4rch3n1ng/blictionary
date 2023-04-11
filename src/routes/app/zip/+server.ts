import { cache } from "$lib/entry"
import { json } from "@sveltejs/kit"

export async function GET () {
	const zip = await cache.zip()
	return json([ ...zip ])
}
