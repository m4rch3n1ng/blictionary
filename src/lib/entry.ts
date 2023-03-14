import { existsSync } from "node:fs"
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

// add proper caching
// reload the cache sometimes
let allEntries: null | smallEntry[] = null
export async function fetchAllEntries () {
	if (allEntries) {
		return allEntries
	} else {
		const path = "entries"
		const all = await readdir(path)
		const smallEntries: smallEntry[] = await Promise.all(
			all.filter(( fileName ) => /\.json$/.test(fileName)).map(async ( fileName ) => {
				const filePath = joinPath(path, fileName)
				return tmpTDelay(filePath, fileName.slice(0, -5))
			})
		)

		allEntries = smallEntries
		return smallEntries.sort(( a, b ) => +a.id - +b.id)
	}
}

// name
// type the error
async function tmpTDelay ( filePath: string, id: string ): Promise<smallEntry> {
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
			// return new Promise<smallEntries>(( resolve ) => {
			// 	setTimeout(() => resolve(tmpTDelay(filePath, id)), 0)
			// })
			return tmpTDelay(filePath, id)
		} else {
			throw e
		}
	}
}
