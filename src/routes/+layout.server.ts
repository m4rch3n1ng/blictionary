import { fetchAllEntries } from "$lib/entry"
import type { LayoutServerLoadEvent } from "./$types"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	// load times are only slow because of data serialization
	// todo find some way to compress and decompress on the server side
	const allEntries = await fetchAllEntries()
	return {
		allEntries,
		theme: cookies.get("theme")
	}
}
