import { z } from "zod"
import { existsSync } from "node:fs"
import { readFile, readdir } from "node:fs/promises"
import { join as joinPath } from "node:path"

interface Pronounciation {
	rp: string
	us: string
	note?: string
}

export interface Definition {
	text: string
	quotes?: Quote[]
}

export interface TopDefinition {
	text?: string
	sub: Definition[]
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

export interface Entry {
	word: string
	class: string | string[]
	pronounciation: Pronounciation
	forms?: string | string[]
	etymology: string | string[]
	definitions: (Definition | TopDefinition)[]
	sub?: SubEntry[]
}

const zPronounciation = z.object({
	rp: z.string(),
	us: z.string(),
	note: z.string().optional()
})

const zQuote = z.object({
	date: z.string(),
	author: z.string(),
	location: z.string(),
	text: z.string(),
	note: z.string().optional()
})

const zDefinition = z.object({
	text: z.string(),
	quotes: z.array(zQuote).optional(),
})

const zTopDefinition = z.object({
	text: z.string().optional(),
	sub: z.array(zDefinition).min(1),
	quotes: z.array(zQuote).optional()
})

const zSubEntry = z.object({
	word: z.string(),
	class: z.union([ z.string(), z.array(z.string()).min(1) ]),
	definition: z.string(),
	quotes: z.array(zQuote).optional()
})

export const zEntry = z.object({
	word: z.string(),
	class: z.union([ z.string(), z.array(z.string()).min(1) ]),
	pronounciation: zPronounciation,
	forms: z.union([ z.string(), z.array(z.string()).min(1) ]).optional(),
	etymology: z.union([ z.string(), z.array(z.string()).min(1) ]),
	definitions: z.array(z.union([ zDefinition, zTopDefinition ])).min(1),
	sub: z.array(zSubEntry).optional()
})

// todo do i want to fill empty spaces ?
function nextId ( ids: number[] ) {
	let curr = 1
	for (const id of ids) {
		if (id === 405 && curr === 403) {
			curr = 405
		} else if (id - curr > 1) {
			return curr + 1 === 404 ? 405 : curr + 1
		} else {
			curr = id
		}
	}

	return curr + 1 === 404 ? 405 : curr + 1
}

export async function nextEntry () {
	const entries = await readdir("entries")

	const fileIds = entries.filter(( str ) => str.endsWith(".json")).map(( str ) => str.slice(0, -5))
	const ids = fileIds.map(( id ) => Number(id)).sort(( a, b ) => a - b)
	const next = nextId(ids)

	return next
}

export function hasEntry ( id: string ) {
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

export async function fetchAllEntries () {
	const path = "entries"
	const all = await readdir(path)
	const allEntries: smallEntry[] = await Promise.all(
		all.filter(( fileName ) => /\.json$/.test(fileName)).map(async ( fileName ) => {
			const filePath = joinPath(path, fileName)
			const content = await readFile(filePath)
			const entry: Entry = JSON.parse(content.toString())
			return {
				id: fileName.slice(0, -5),
				word: entry.word,
				class: entry.class
			}
		})
	)

	return allEntries
}
