import { redirect } from "@sveltejs/kit"
import { filter as fuzzyFilter } from "fuzzyjs"
import type { PageServerLoadEvent } from "./$types"

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
		throw redirect(301, `/view/${allFind[0].id}/${allFind[0].word}`) // todo
	}

	const filteredMeta = allMeta.filter(fuzzyFilter(query, { iterator: ({ word }) => word }))

	return {
		search: filteredMeta
	}
}
