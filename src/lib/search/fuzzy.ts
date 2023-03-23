interface minimumEntry {
	word: string
	class: string | string[]
}

export function fuzzy <T extends minimumEntry> ( search: string, allEntries: T[] ): T[] {
	const spl = splitSearchString(search)
	if (!spl) return []

	const wordScore = initWordScoring(spl.search)
	const allScores: (T & { score: number })[] = allEntries.map(( entry ) => ({ ...entry, score: wordScore.score(entry.word, entry.class) }))
	return allScores.filter(({ score }) => score !== 0).sort(( m1, m2 ) => m2.score - m1.score)
}

function initWordScoring ( search: string[] ) {
	const fullRegex = initRegex(search)

	return {
		// todo num
		score ( word: string, wordClass: string | string[] ): number {
			const words = word.split(/ +/g).filter(( w ) => w)

			if (words.length === 1) {
				const [ wordRegex, classRegex ] = fullRegex

				const wordScore = wordRegex!.match(word) || 0
				if (!wordScore) return 0

				const wordStartScore = wordRegex!.start(word) || 0
				const classScore = ( classRegex && classRegex.class === wordClass ) ? 1 : 0
				const fullScore = search[0] === word ? 1 : 0
				return wordScore + wordStartScore + classScore + fullScore
			} else if (words.length >= 2) {
				const wordsRegex = fullRegex.slice(0, words.length)
				const classRegex = fullRegex[words.length]

				const wordScore = wordsRegex.reduce(( sum, regex, i ) => {
					const tmpScore = regex.match(word)
					if (!tmpScore) return sum

					return sum + tmpScore + regex.start(words[i])
				}, 0)

				if (!wordScore) return 0

				const classScore = classRegex && classRegex.class === wordClass ? 1 : 0
				const fullScore = words.reduce(( sum, w ) => sum + +search.includes(w), 0)
				return wordScore + classScore + fullScore
			}

			return 0
		}
	}
}

// i should be able to halve the amount of regexes by replacing two characters at once i think ?
// .reduce is perhaps slow
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

// making the regex less complex could make it faster ?
function makeRegexString ( all: string[] ): string[] {
	// todo ? or {0,2}
	const matches = all.length === 1 ? [ all ] : [ all ].concat(all.map(( _v, i ) => replaceAtIndex(all, i, "[^\\s,.!?$]{0,2}")))
	return matches.map(( word ) => word.join(""))
}

// this could be faster as a simple a[i] call (only works if i keep current replace logic)
// also this only gets called once per input, not super important
function replaceAtIndex ( arr: string[], i: number, rep: string ) {
	const a = [ ...arr ]
	a.splice(i, 1, rep)
	return a
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping 
function escapeRegex ( w: string ) {
	return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
