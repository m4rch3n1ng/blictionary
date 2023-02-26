import type { RequestHandler } from "./$types"

export const GET: RequestHandler = ({ url }) => {
	const nUrl = url.searchParams.get("url") || "/"
	const theme = url.searchParams.get("theme")

	return new Response(null, {
		status: 301,
		headers: {
			location: nUrl,
			"set-cookie": `theme=${theme}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure`,
			"cache-control": "no-cache, no-store, must-reavlidate",
			pragma: "no-cache",
			expires: "0"
		}
	})
}
