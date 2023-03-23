import { redirect } from "@sveltejs/kit"
import type { smallEntry } from "$lib/entry"
import { fuzzy } from "$lib/search/fuzzy"
import { slugify } from "$lib/markdown"
import type { PageServerLoadEvent } from "./$types"

export async function load ({ parent, url }: PageServerLoadEvent ) {
	const { allEntries } = await parent()
	const query = url.searchParams.get("q")

	if (!query) {
		if (url.searchParams.has("q")) throw redirect(301, "/search")
		return {
			search: allEntries
		}
	}

	const allFind = allEntries.filter(({ word }) => word === query)
	if (allFind.length === 1 && allFind[0]) {
		const entry = allFind[0]
		throw redirect(301, `/view/${entry.id}/${slugify(entry.word)}`) // todo
	}

	const limitedQuery = query.length > 100 ? query.slice(0, 100) : query
	const filteredEntries = fuzzy<smallEntry>(limitedQuery, allEntries)

	return {
		search: filteredEntries
	}
}
