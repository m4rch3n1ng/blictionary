export function load ({ params }) {
	return {
		word: decodeURIComponent(params.name)
	}
}
