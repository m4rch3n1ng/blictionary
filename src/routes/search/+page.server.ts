import { fuzzy } from "$lib/search/fuzzy"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoadEvent } from "./$types"
import { slugify } from "$lib/markdown"

export async function load ({ parent, url }: PageServerLoadEvent ) {
	const { allMeta } = await parent()
	const query = url.searchParams.get("q")

	if (!query) {
		if (url.searchParams.has("q")) throw redirect(301, "/search")
		return {
			search: allMeta
		}
	}

	const allFind = allMeta.filter(({ word }) => word === query)
	if (allFind.length === 1 && allFind[0]) {
		const entry = allFind[0]
		throw redirect(301, `/view/${entry.id}/${slugify(entry.word)}`) // todo
	}

	const limitedQuery = query.length > 100 ? query.slice(0, 100) : query
	const filteredMeta = fuzzy(limitedQuery, allMeta)

	return {
		search: filteredMeta
	}
}
