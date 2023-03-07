import { fuzz } from "$lib/fuzzy"
import { redirect } from "@sveltejs/kit"
// import { filter as fuzzyFilter } from "fuzzyjs"
import { slugify } from "$lib/markdown"

export async function load ({ parent, url }) {
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

	// todo limit query length
	const filteredEntries = fuzz(allEntries, query)

	return {
		search: filteredEntries
	}
}
