import { getEntry, hasEntry } from "$lib/entry"
import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoadEvent } from "./$types"

export async function load ({ params, parent }: PageServerLoadEvent ) {
	const { allMeta } = await parent()

	const id = params.id
	if (!hasEntry(id)) throw error(404, "not found")

	const entry = await getEntry(id)
	if (entry.word !== params.name) throw redirect(301, `/view/${params.id}/${entry.word}`) // todo cleanup sluggify

	return { entry, allMeta }
}
