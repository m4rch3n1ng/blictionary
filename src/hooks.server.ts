import type { MaybePromise } from "$app/forms"
import type { Handle } from "@sveltejs/kit"

export function handle ({ event, resolve }: Parameters<Handle>[0] ): MaybePromise<Response> {
	const theme = event.cookies.get("theme")
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace("%theme%", theme || "")
	})
}
