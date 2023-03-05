import type { smallEntry } from "./entry"

// todo refine exclusion [^\s,.!$] probably
// need to exclude: more punctuation, fucked up punctuation
// ? https://perldoc.perl.org/perlunicode#Unicode-Character-Properties
// also i have the feeling that this is not hard to break somehow
// todo somewhere remove quotes, brackets?, parenthesis?
const regexOfDoom = /^([^\s,.!$]+)[\s,.!$]*([^\s,!$]+)?[\s,.!$]*(\d+)?/

// todo actually name stuff
// todo do stuff with class and num
// todo refine some stuff probably
// todo sort
export function fuzz ( allEntries: smallEntry[], search: string ): smallEntry[] {
	if (!regexOfDoom.test(search)) return []

	const [ , word, wordClass, num ] = [ ...regexOfDoom.exec(search)!.values() ]
	console.log({ word, wordClass, num })

	const wordRegex = initWordRegex(word!)
	const _allEntries: (smallEntry & { score: number })[] = allEntries.map(( entry ) => ({ ...entry, score: wordRegex.score(entry.word) }))
	return _allEntries.filter(({ score }) => score !== 0)
}

function initWordRegex ( word: string ) {
	const all = [ ...word ].map(_escReg)
	// todo maybe limit [^\\s,.!$] amt
	// todo extra score for positional / full word match
	const $all = all.length === 1 ? [ all ] : all.map(( _v, i ) => replaceAtIndex(all, i, "[^\\s,.!$]*"))
	const allReg = $all.map(( str ) => new RegExp(`${str.join("")}`, "i"))

	return {
		// todo better scoring ?
		score ( word: string ) {
			return allReg.reduce(( prev, curr ) => prev + ( curr.test(word) ? 1 : 0 ), 0)
		}
	}
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
