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

export interface smallMeta {
	id: string
	word: string
	class: string | string[],
}

export async function fetchAllMeta () {
	const path = "entries"
	const all = await readdir(path)
	const allMeta: smallMeta[] = await Promise.all(
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

	return allMeta
}
