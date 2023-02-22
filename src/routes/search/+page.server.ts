import { redirect } from "@sveltejs/kit"
import type { PageServerLoadEvent } from "./$types"

export async function load ({ parent, url }: PageServerLoadEvent ) {
	const { allMeta } = await parent()

	if (!url.searchParams.has("q")) {
		return
	}

	const allFind = allMeta.filter(({ word }) => word === url.searchParams.get("q"))
	if (allFind.length === 1 && allFind[0]) {
		throw redirect(301, `/view/${allFind[0].id}/${allFind[0].word}`) // todo 
	}

	return
}
