import { text } from "@sveltejs/kit"

// todo make 404 page
export async function GET () {
	return text("this does not exist yet")
}
