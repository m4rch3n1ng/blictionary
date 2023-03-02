import { readdir, rm } from "node:fs/promises"
import { dirname, join as joinPath } from "node:path"
import { fileURLToPath } from "node:url"

export const __dirname = dirname(dirname(fileURLToPath(import.meta.url)))

export async function emptyDir ( directory ) {
	const files = await readdir(directory)
	return Promise.all(files.map(( file ) => rm(joinPath(directory, file), { recursive: true })))
}
