import { redirect } from "@sveltejs/kit"

// todo make 404 page
export function GET (): Response {
	throw redirect(301, "/")
}
