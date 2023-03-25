import type { LayoutServerLoadEvent } from "./$types"

export async function load ({ cookies }: LayoutServerLoadEvent ) {
	return {
		theme: cookies.get("theme")
	}
}
