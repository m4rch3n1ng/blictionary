import CheapWatch from "cheap-watch"
import { existsSync, type Stats } from "node:fs"
import { readFile, readdir } from "node:fs/promises"
import { join as joinPath } from "node:path"

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
	}

	function minus ({ path: fileName }: { path: string }) {
		const id = fileName.slice(0, -5)
		allEntryMap.delete(id)
	}


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

	return {
		async get (): Promise<smallEntry[]> {
			if (allEntries) {
				return allEntries
			} else {
				return hit()
			}
		}
	}
}

export const cache = entryCache()
