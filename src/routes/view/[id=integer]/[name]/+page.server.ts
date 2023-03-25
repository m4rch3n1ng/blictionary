import { cache, getEntry, hasEntry, type Entry, type Quote, type smallEntry, type SubEntry } from "$lib/entry"
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

// this should probably be added to the cache
const matcher = /\[\[([^\n]+?), ([^\n]+?\.)\]\]/g
function filterEntries ( allEntries: smallEntry[], entry: Entry ) {
	const allToFind: RegExpMatchArray[] = []

	allToFind.push(...matchTwo(entry.etymology))
	if (entry.forms) allToFind.push(...matchTwo(entry.forms))
	if (entry.pronounciation.note) allToFind.push(...matchOne(entry.pronounciation.note))

	allToFind.push(...fromDef(entry.definitions))
	if (entry.sub) allToFind.push(...fromSub(entry.sub))

	const filteredEntries = allToFind.map(findOne.bind(null, allEntries)).filter(( entry ) => entry !== null)
	return filteredEntries
}

function findOne ( allEntries: smallEntry[], [ , word, wordClass ]: RegExpMatchArray ) {
	const found = allEntries.find(( entry ) => (
		entry.word === word && ( Array.isArray(entry.class) ? entry.class.includes(wordClass!) : entry.class === wordClass )
	))
	return found || null
}

function matchTwo ( inp: string[] | string ) {
	if (Array.isArray(inp)) {
		return matchOne(inp.join("\n"))
	} else {
		return matchOne(inp)
	}
}

function matchOne ( inp: string ) {
	return inp.matchAll(matcher)
}

function fromDef ( defs: Entry["definitions"] ): RegExpMatchArray[] {
	return defs.flatMap(( def ) => {
		if ("sub" in def) {
			const q = fromQuotes(def.quotes)
			const t = def.text ? matchOne(def.text) : []
			return [ ...t, ...q, ...fromDef(def.sub) ]
		} else {
			const q = fromQuotes(def.quotes)
			return [ ...matchOne(def.text), ...q ]
		}
	})
}

// .quotes.text ?
function fromQuotes ( quotes: undefined | Quote[] ): RegExpMatchArray[] {
	if (!quotes || quotes.length === 0) return []
	return quotes.flatMap(( quote ) => quote.note ? [ ...quote.note.matchAll(matcher) ] : [])
}

function fromSub ( subDef: SubEntry[] ) {
	return subDef.flatMap(( sub ) => [ ...matchOne(sub.definition), ...fromQuotes(sub.quotes) ])
}
