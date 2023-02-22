import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/kit/vite"


/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csp: {
			mode: "auto",
			directives: {
				"default-src": [ "self" ],
				"style-src": [ "self", "unsafe-inline" ],
				"script-src": [ "strict-dynamic" ],
				"base-uri": [ "none" ],
				"child-src": [ "none" ]
			}
		}
	}
}
