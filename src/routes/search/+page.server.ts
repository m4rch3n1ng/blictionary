import { fuzz } from "$lib/fuzzy"
import { redirect } from "@sveltejs/kit"
// import { filter as fuzzyFilter } from "fuzzyjs"
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

	// todo limit query length
	const filteredMeta = fuzz(allMeta, query)

	return {
		search: filteredMeta
	}
}
