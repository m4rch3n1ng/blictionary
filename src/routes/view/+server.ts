import { redirect } from "@sveltejs/kit"

export function GET (): Response {
	throw redirect(301, "/")
}
