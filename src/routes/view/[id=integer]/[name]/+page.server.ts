import { cache, getEntry, hasEntry } from "$lib/entry"
import { slugify } from "$lib/markdown"
import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoadEvent } from "./$types"

export async function load ({ params }: PageServerLoadEvent ) {
	const allEntries = await cache.get()

	const id = params.id
	if (!hasEntry(id)) throw error(404, "not found")

	const entry = await getEntry(id)
	const entrySlug = slugify(entry.word)
	if (entrySlug !== params.name) throw redirect(301, `/view/${params.id}/${entrySlug}`)

	return {
		// filter allEntries for useful ones only
		allEntries: allEntries.slice(0, 1),
		entry
	}
}
