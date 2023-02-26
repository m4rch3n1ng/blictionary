// todo theme writable
// todo theme util

import { browser } from "$app/environment"
import { writable } from "svelte/store"

// todo maybe utils
function getCookie ( name: string ): string | undefined {
	const cookie = `; ${document.cookie}`.match(`;\\s*${name}=([^;]+)`);
    return cookie ? cookie[1] : ''
}

function updateCookie ( theme: string | undefined ) {
	if (theme) {
		document.cookie = `theme=${theme}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure`
	} else {
		document.cookie = `theme=; path=/; expires=${new Date(0)}; secure`
	}
}

export function invertTheme ( theme: string | undefined ) {
	return theme === "light" ? "dark" : "light"
}

export function initTheme ( init: string | undefined ) {
	const doc = browser ? document.querySelector(":root") : null
	const { subscribe, set: $set } = writable<string | undefined>(init)
	
	function set ( theme: string | undefined, cookie: boolean = true ) {
		if (doc) {
			doc.className = theme || ""
			if (cookie) updateCookie(theme)
		}

		$set(theme)
	}

	function invert ( theme: string | undefined ) {
		const nTheme = invertTheme(theme)
		set(nTheme)
	}

	function cookie (): boolean {
		const c = getCookie("theme")
		return Boolean(c)
	}

	return {
		subscribe,
		set,
		cookie,
		invert
	}
}
