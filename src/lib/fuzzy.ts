import type { smallMeta } from "./entry"

export function fuzzy ( allMeta: smallMeta[], search: string ): smallMeta[] {
	const spl = splitSearchString(search)
	if (!spl) return []

	const wordScore = initWordScoring(spl.search)
	const allScores: (smallMeta & { score: number })[] = allMeta.map(( meta ) => ({ ...meta, score: wordScore.score(meta.word, meta.class) }))
	return allScores.filter(({ score }) => score !== 0).sort(( m1, m2 ) => m2.score - m1.score)
}

function initRegex ( search: string[] ) {
	return search.map(( str ) => {
		const wordSplit = [ ...str ].map(escapeRegex)
		const wordReg = makeRegexString(wordSplit)

		const matchReg = wordReg.map(( str ) => new RegExp(`${str}`, "i"))
		const startReg = wordReg.map(( str ) => new RegExp(`^${str}`))

		return {
			class: /\.$/.test(str) ? str : `${str}.`,
			match ( word: string ) {
				return matchReg.reduce(( prev, curr ) => prev + ( curr.test(word) ? 1 : 0 ), 0)
			},
			start ( word: string | undefined ) {
				if (!word) return 0
				const isStart = startReg.some(( startReg ) => startReg.test(word))
				return isStart ? 1 : 0
			}
		}
	})
}

function initWordScoring ( search: string[] ) {
	const fullRegex = initRegex(search)

	return {
		// todo num
		score ( word: string, wordClass: string | string[] ): number {
			const words = word.split(/ +/g).filter(( w ) => w)

			if (words.length === 1) {
				const [ wordRegex, classRegex ] = fullRegex

				const wordScore = wordRegex!.match(word) + wordRegex!.start(word) || 0
				const classScore = ( classRegex?.class && classRegex.class === wordClass ) ? 1 : 0
				const fullScore = search[0] === word ? 1 : 0
				return wordScore + classScore + fullScore
			} else if (words.length >= 2) {
				const wordsRegex = fullRegex.slice(0, words.length)
				const classRegex = fullRegex[words.length]

				const wordScore = wordsRegex.reduce(( sum, regex, i ) => sum + regex.match(word) + regex.start(words[i]), 0)
				const classScore = classRegex?.class && classRegex.class === wordClass ? 1 : 0
				const fullScore = words.reduce(( sum, w ) => sum + +search.includes(w), 0)
				return wordScore + classScore + fullScore
			}

			return 0
		}
	}
}

interface searchSplit {
	search: string[]
	num?: number
}

// todo refine split [\s"'()\[\]{},.!?$] probably
// todo num
const regexSplit = /[\s"'()\[\]{},.!?$]+/g
function splitSearchString ( search: string ): null | searchSplit {
	const split = search.split(regexSplit).filter(( w ) => w)

	if (!split.length) return null
	return { search: split }
}

function makeRegexString ( all: string[] ): string[] {
	// todo {1,2} or {0,2}
	const matches = all.length === 1 ? [ all ] : all.map(( _v, i ) => replaceAtIndex(all, i, "[^\\s,.!?$]{0,2}"))
	return matches.map(( word ) => word.join(""))
}

function replaceAtIndex ( arr: string[], i: number, rep: string ) {
	const a = [ ...arr ]
	a.splice(i, 1, rep)
	return a
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping 
function escapeRegex ( w: string ) {
	return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
