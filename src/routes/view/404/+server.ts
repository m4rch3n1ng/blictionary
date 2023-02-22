import { redirect } from "@sveltejs/kit"

// todo make 404 page
export async function GET () {
	throw redirect(301, "/")
}
