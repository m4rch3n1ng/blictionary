import { existsSync } from "node:fs"
import { copyFile, cp, mkdir, writeFile } from "node:fs/promises"
import { join as joinPath } from "node:path"
import pkg from "../package.json" assert { type: "json" }
import { __dirname } from "./_utils.js"

async function main () {
	const buildPath = joinPath(__dirname, "build")
	if (!existsSync(buildPath)) await mkdir(buildPath)
	if (!existsSync(joinPath(buildPath, "entries"))) await mkdir(joinPath(buildPath, "entries"))

	await cp(joinPath(__dirname, "dist"), joinPath(buildPath, "web"), { recursive: true })
	await copyFile("LICENSE", joinPath(buildPath, "LICENSE"))

	await writeFile(joinPath(buildPath, "package.json"), JSON.stringify({
		name: pkg.name,
		version: pkg.version,
		author: pkg.author,
		license: pkg.license,
		main: "./web/index.js",
		scripts: {
			web: "node ."
		},
		dependencies: pkg.dependencies,
		type: "module",
		private: true
	}, null, "\t") + "\n")
}

main()
