import { fetchAllEntries } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	const allEntries = await fetchAllEntries()
	return { allEntries, theme: cookies.get("theme") }
}
