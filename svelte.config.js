import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/kit/vite"

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ out: "dist" }),
		csp: {
			mode: "auto",
			directives: {
				"default-src": [ "self" ],
				"script-src": [ "self" ], // todo fix "strict-dynamic"
				"style-src": [ "self", "unsafe-inline" ],
				"font-src": [ "self", "data:" ],
				"img-src": [ "self", "data:" ],
				"base-uri": [ "none" ],
				"child-src": [ "none" ]
			}
		}
	}
}
