import { fetchAllEntries } from "$lib/entry"

export async function load ({ cookies }) {
	// load times are only slow because of data serialization
	// todo find some way to compress and decompress on the server side
	const allEntries = await fetchAllEntries()
	return {
		allEntries,
		theme: cookies.get("theme")
	}
}
