import { join as joinPath } from "node:path"
import { existsSync } from "node:fs"
import { emptyDir, __dirname } from "./_utils.js"

async function main () {
	const buildPath = joinPath(__dirname, "build")
	if (existsSync(buildPath)) await emptyDir(buildPath)
}

main()
