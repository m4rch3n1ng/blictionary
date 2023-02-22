import { hasEntry, getEntry } from "$lib/entry"
import { error, redirect } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"

export async function GET ({ params }: RequestEvent ) {
	if (!hasEntry(params.id)) throw error(404, "not found")
	const { word } = await getEntry(params.id)
	throw redirect(301, `/view/${params.id}/${word}`) // todo cleanup sluggify
}
