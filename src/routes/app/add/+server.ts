import { zEntry } from "$lib/entry.js"
import { error, redirect } from "@sveltejs/kit"
import { ZodError } from "zod"

export async function POST ({ request }) {
	const data = await request.formData()
	const file = data.get("file")
	if (!(file instanceof File)) {
		throw error(400, "no file given")
	}

	try {
		const fileContent = await file.text()
		const fileJson = JSON.parse(fileContent)

		console.log(zEntry.parse(fileJson))
	} catch ( err ) {
		handleError(err)
	}

	const dataUrl = data.get("url")
	const redirectUrl = typeof dataUrl === "string" ? dataUrl : "/add"
	throw redirect(301, redirectUrl)
}

function handleError ( err: unknown ): never {
	if (err instanceof ZodError) {
		// todo format zod error
		throw error(400, JSON.stringify(err.issues, null, "\t"))
	} else if (err instanceof Error) {
		throw error(400, err.message)
	} else if (err === "string") {
		throw error(400, err)
	} else {
		throw error(400, "something went wrong")
	}
}
