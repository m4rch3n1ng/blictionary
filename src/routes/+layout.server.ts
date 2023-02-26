import { fetchAllMeta } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	const allMeta = await fetchAllMeta()
	return { allMeta, theme: cookies.get("theme") }
}
