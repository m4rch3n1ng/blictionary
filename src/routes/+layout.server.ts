import { fetchAllEntries } from "$lib/entry"

export async function load ({ cookies }) {
	const allEntries = await fetchAllEntries()
	return { allEntries, theme: cookies.get("theme") }
}
