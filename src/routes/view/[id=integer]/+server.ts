import { hasEntry, getEntry } from "$lib/entry"
import { slugify } from "$lib/markdown"
import { error, redirect } from "@sveltejs/kit"

export async function GET ({ params }): Promise<Response> {
	if (!hasEntry(params.id)) throw error(404, "not found")

	const { word } = await getEntry(params.id)
	throw redirect(301, `/view/${params.id}/${slugify(word)}`)
}
