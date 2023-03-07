import type { smallEntry } from "./entry"

// todo refine exclusion [^\s,.!?$] probably
// need to exclude: more punctuation, fucked up punctuation
// ? https://perldoc.perl.org/perlunicode#Unicode-Character-Properties
// also i have the feeling that this is not hard to break somehow
// nope it's not: ex leading whitespace, punct.
// todo somewhere remove quotes, brackets?, parenthesis?
const regexOfDoom = /^([^\s,.!?$]+)[\s,.!?$]*([^\s,.!?$]+)?[\s,.!?$]*(\d+)?/

// todo actually name stuff
// todo do stuff with class and num
// todo refine some stuff probably
// todo sort
export function fuzz ( allEntries: smallEntry[], search: string ): smallEntry[] {
	const spl = splitSearch(search)
	if (!spl) return []

	const wordScore = initWordScoring(spl.word)
	const allScores: (smallEntry & { score: number })[] = allEntries.map(( entry ) => ({ ...entry, score: wordScore.score(entry.word, entry.class) }))
	return allScores.filter(({ score }) => score !== 0).sort(( s1, s2 ) => s2.score - s1.score)
}

function initWordScoring ( word: string ) {
	const all = [ ...word ].map(_escReg)
	const wordReg = makeWordReg(all)

	const matchReg = wordReg.map(( str ) => new RegExp(`${str}`, "i"))
	const startReg = wordReg.map(( str ) => new RegExp(`^${str}`))

	return {
		// todo better scoring ?
		// todo score for class
		// todo open compound words
		score ( word: string, _wordClass: string | string[] ) {
			const matches = matchReg.reduce(( prev, curr ) => prev + ( curr.test(word) ? 1 : 0 ), 0)
			const isStart = startReg.some(( startReg ) => startReg.test(word))
			return matches + +isStart
		}
	}
}

interface searchSplit {
	word: string
	class?: string
	num?: number
}

function splitSearch ( search: string ): null | searchSplit {
	if (!regexOfDoom.test(search)) return null

	const [ , word, wordClass, num ] = [ ...regexOfDoom.exec(search)!.values() ]
	return { word: word!, class: wordClass, num: num != null ? Number(num) : num }
}

function makeWordReg ( all: string[] ): string[] {
	const match = all.length === 1 ? [ all ] : all.map(( _v, i ) => replaceAtIndex(all, i, "[^\\s,.!?$]{1,2}"))
	return match.map(( en ) => en.join(""))
}

function replaceAtIndex ( arr: string[], i: number, rep: string ) {
	const a = [ ...arr ]
	a.splice(i, 1, rep)
	return a
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping 
function _escReg ( w: string ) {
	return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
