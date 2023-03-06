import { marked } from "marked"
import type { smallMeta } from "./entry"
import slugify from "@sindresorhus/slugify"

export let inlineMarkdown: ( md: string ) => string

export function initMark ( allMeta: smallMeta[] ) {
	const markedExtensions: marked.TokenizerAndRendererExtension[] = [
		{
			name: "underline",
			level: "inline",
			start ( src ) {
				return src.match(/__/)?.index
			},
			tokenizer ( src ) {
				const rule = /^__([^\n]+?)__/
				const match = rule.exec(src)
				if (match) {
					return {
						type: "underline",
						raw: match[0],
						string: match[1]
					}
				} else {
					return undefined
				}
			},
			renderer ( token ) {
				return `<ins>${token.string}</ins>`
			}
		},
		{
			name: "selflink",
			level: "inline",
			start ( src ) {
				return src.match(/\[\[/)?.index
			},
			tokenizer ( src ) {
				const rule = /^\[\[([^\n]+?), ([^\n]+?\.)\]\]/
				const match = rule.exec(src)
				if (match) {
					return {
						type: "selflink",
						raw: match[0],
						word: match[1],
						class: match[2],
						render: ""
					}
				} else {
					return undefined
				}
			},
			renderer ( token ) {
				const found = findEntry(token.word, token.class, allMeta)
				const href = found ? `/view/${found.id}/${slugify(token.word)}` : `/view/404/${encodeURIComponent(token.word)}`
				token.render = `<a class="md-link" href="${href}"><span class="md-word">${token.word}</span>, <em>${token.class}</em></a>`
				return token.render
			}
		}
	]

	const renderer = new marked.Renderer
	renderer.link = ( href, title, text ) => {
		if (href === null) {
			return text
		}
	
		let out = "<a class=\"md-link\" href=\"" + href + "\""
		if (title) {
			out += " title=\"" + title + "\""
		}
		out += ">" + text + "</a>"

		return out
	}

	marked.use({ extensions: markedExtensions, renderer })

	inlineMarkdown = function ( md: string ): string {
		return marked.parseInline(md)
	}

	return function ( md: string, inline: boolean = true ): string {
		return inline ? marked.parseInline(md) : marked.parse(md)
	}
}

function findEntry ( word: string, wordClass: string, allMeta: smallMeta[] ) {
	const found = allMeta.find(( meta ) => (
		meta.word === word && ( Array.isArray(meta.class) ? meta.class.includes(wordClass) : meta.class === wordClass )
	))
	return found
}

export function wordClassToString ( wordClass: string | string[], html: boolean ) {
	if (!Array.isArray(wordClass)) return html ? `<em>${wordClass}</em>` : wordClass

	let string = ""
	for (let i = 0; i < wordClass.length; i++) {
		string += html ? `<em>${wordClass[i]}</em>` : wordClass[i]

		if (i < wordClass.length - 1 && wordClass.length >= 3) {
			string += ", "
		}
		
		if (i == wordClass.length - 2) {
			string += wordClass.length === 2 ? " and " : "and "
		}
	}

	return string
}
