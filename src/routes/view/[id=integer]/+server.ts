import { cache, getEntry } from "$lib/entry"
import { slugify } from "$lib/markdown"
import { error, redirect } from "@sveltejs/kit"

export async function GET ({ params }): Promise<Response> {
	const exists = await cache.has(params.id)
	if (!exists) throw error(404, "not found")

	const { word } = await getEntry(params.id)
	throw redirect(301, `/view/${params.id}/${slugify(word)}`)
}
