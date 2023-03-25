import { cache, getEntry, hasEntry, type Entry, type smallEntry } from "$lib/entry"
import { slugify } from "$lib/markdown"
import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoadEvent } from "./$types"

export async function load ({ params }: PageServerLoadEvent ) {
	const id = params.id
	if (!hasEntry(id)) throw error(404, "not found")

	const entry = await getEntry(id)
	const entrySlug = slugify(entry.word)
	if (entrySlug !== params.name) throw redirect(301, `/view/${params.id}/${entrySlug}`)

	const allEntries = await cache.get()
	const filteredEntries = filterEntries(allEntries, entry)

	return {
		allEntries: filteredEntries,
		entry
	}
}

// look for references in
// + definitions
// 	.text
// 	.quotes
// 	.sub.text
// 	.sub.quotes
// + sub
// 	.definition
// 	.quotes
// 
// $ quotes
// 	.quotes.note
// 	.quotes.text ?
const matcher = /\[\[([^\n]+?), ([^\n]+?\.)\]\]/g
function filterEntries ( allEntries: smallEntry[], entry: Entry ) {
	const allToFind: RegExpMatchArray[] = []

	allToFind.push(...matchOne(entry.etymology))
	if (entry.forms) allToFind.push(...matchOne(entry.forms))
	if (entry.pronounciation.note) allToFind.push(...matchOne(entry.pronounciation.note))

	const filteredEntries = allToFind.map(findOne.bind(null, allEntries)).filter(( entry ) => entry !== null)
	return filteredEntries
}

function findOne ( allEntries: smallEntry[], [ , word, wordClass ]: RegExpMatchArray ) {
	const found = allEntries.find(( entry ) => (
		entry.word === word && ( Array.isArray(entry.class) ? entry.class.includes(wordClass!) : entry.class === wordClass )
	))
	return found || null
}

function matchOne ( inp: string | string[] ) {
	if (Array.isArray(inp)) {
		return inp.join("\n").matchAll(matcher)
	} else {
		return inp.matchAll(matcher)
	}
}
