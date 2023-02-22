import { fetchAllMeta } from "$lib/entry"

export async function load () {
	const allMeta = await fetchAllMeta()
	return { allMeta }
}
