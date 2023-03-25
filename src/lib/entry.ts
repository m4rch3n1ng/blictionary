import CheapWatch from "cheap-watch"
import { existsSync, type Stats } from "node:fs"
import { readFile, readdir } from "node:fs/promises"
import { join as joinPath } from "node:path"
import { gzip as gzipCb } from "node:zlib"
import { promisify } from "node:util"
import { findEntry } from "./markdown"

const gzip = promisify(gzipCb)

export interface Entry {
	word: string
	class: string | string[]
	pronounciation: Pronounciation
	forms?: string | string[]
	etymology: string | string[]
	definitions: (Definition | TopDefinition)[]
	sub?: SubEntry[]
}

interface Pronounciation {
	rp: string
	us: string
	note?: string
}

export interface TopDefinition {
	text?: string
	sub: Definition[]
	quotes?: Quote[]
}

export interface Definition {
	text: string
	quotes?: Quote[]
}

export interface SubEntry {
	word: string
	class: string | string[]
	definition: string
	quotes?: Quote[]
}

export interface Quote {
	date: string
	author: string
	location: string
	text: string
	note?: string
}

export function hasEntry ( id: string ) {
	// todo validate entry
	const path = joinPath("entries", `${id}.json`)
	return existsSync(path)
}

export async function getEntry ( id: string ): Promise<Entry> {
	const entryPath = joinPath("entries", `${id}.json`)
	const entryFile = await readFile(entryPath)
	const entry: Entry = JSON.parse(entryFile.toString()) as Entry
	return entry
}

export interface smallEntry {
	id: string
	word: string
	class: string | string[],
}

function entryCache () {
	const path = "entries"

	const allEntryMap = new Map<string, smallEntry>
	let allEntries: smallEntry[] | null = null

	const selflinkMap = new Map<string, [ string, string ][]>

	/* watcher */
	const watcher = new CheapWatch({ dir: path, filter: watchFilter })
	watcher.init()
	watcher.on("+", plus)
	watcher.on("-", minus)

	function watchFilter ({ path, stats }: { path: string, stats: Stats }) {
		return isJSON(path) && stats.isFile()
	}

	async function plus ({ path: fileName }: { path: string }) {
		const id = fileName.slice(0, -5)
		const filePath = joinPath(path, fileName)

		await hitOnce(filePath, id)
		mapToArray()

		const entry = await getEntry(id)
		const selflinks = getSelflinks(entry)
		selflinkMap.set(id, selflinks)
	}

	function minus ({ path: fileName }: { path: string }) {
		const id = fileName.slice(0, -5)
		allEntryMap.delete(id)
		selflinkMap.delete(id)
	}

	/* util */
	// todo check for id
	// todo function get id
	function isJSON ( name: string ) {
		return /\.json$/.test(name)
	}

	// todo catch json errors
	async function readSmallEntry ( filePath: string, id: string ): Promise<smallEntry> {
		try {
			const content = await readFile(filePath)
			const entry: Entry = JSON.parse(content.toString())
			return {
				id,
				word: entry.word,
				class: entry.class
			}
		} catch ( e: any ) {
			if (e.code === "EMFILE") {
				return readSmallEntry(filePath, id)
			} else {
				throw e
			}
		}
	}

	function mapToArray (): smallEntry[] {
		allEntries = [ ...allEntryMap.values() ].sort(( a, b ) => +a.id - +b.id)
		return allEntries
	}

	/* cache */
	async function hitOnce ( filePath: string, id: string ) {
		const smallEntry = await readSmallEntry(filePath, id)
		allEntryMap.set(smallEntry.id, smallEntry)
	}

	async function hit (): Promise<smallEntry[]> {
		const all = await readdir(path)
		await Promise.all(
			all.filter(isJSON).map(( fileName ) => {
				const filePath = joinPath(path, fileName)
				const id = fileName.slice(0, -5)
				return hitOnce(filePath, id)
			})
		)

		return mapToArray()
	}

	/* selflink */
	const selflinkMatch = /\[\[([^\n]+?), ([^\n]+?\.)\]\]/g
	function getSelflinks ( entry: Entry ) {
		const allToFind: RegExpMatchArray[] = []

		allToFind.push(...matchTwo(entry.etymology))
		if (entry.forms) allToFind.push(...matchTwo(entry.forms))
		if (entry.pronounciation.note) allToFind.push(...matchOne(entry.pronounciation.note))

		allToFind.push(...fromDef(entry.definitions))
		if (entry.sub) allToFind.push(...fromSub(entry.sub))

		return allToFind.map(([, word, wordClass ]) => ([ word, wordClass ] as [ string, string ]))

		function matchTwo ( inp: string[] | string ) {
			if (Array.isArray(inp)) {
				return matchOne(inp.join("\n"))
			} else {
				return matchOne(inp)
			}
		}

		function matchOne ( inp: string ) {
			return inp.matchAll(selflinkMatch)
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
			return quotes.flatMap(( quote ) => quote.note ? [ ...quote.note.matchAll(selflinkMatch) ] : [])
		}

		function fromSub ( subDef: SubEntry[] ) {
			return subDef.flatMap(( sub ) => [ ...matchOne(sub.definition), ...fromQuotes(sub.quotes) ])
		}
	}

	/* */

	async function get (): Promise<smallEntry[]> {
		if (allEntries) {
			return allEntries
		} else {
			return hit()
		}
	}

	function selflink ( id: string, entry: Entry ): [ string, string ][] {
		if (selflinkMap.has(id)) return selflinkMap.get(id)!

		const selflinks = getSelflinks(entry)
		selflinkMap.set(id, selflinks)
		return selflinks
	}

	return {
		get,
		async zip () {
			const nAllEntries = await get()
			const zip = await gzip(JSON.stringify(nAllEntries))
			return zip
		},
		async selflink ( id: string, entry: Entry ) {
			const allEntries = await get()
			const allMatches = selflink(id, entry)

			const resolved = allMatches.map(([ word, wordClass ]) => findEntry(word, wordClass, allEntries))
			return resolved.filter(( entry ) => entry)
		}
	}
}

export const cache = entryCache()
