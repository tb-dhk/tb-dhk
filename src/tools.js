function mod(n, m) {
  return ((n % m) + m) % m;
}

// characters for  (0-9, a-z)
const BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz ';

export let SITELEN_PONA = ''

// range: f1900 to f1988
for (let code = 0xF1900; code <= 0xF1988; code++) {
  SITELEN_PONA += String.fromCodePoint(code)
}

// add f199c and f199d
SITELEN_PONA += String.fromCodePoint(0xF199C, 0xF199D)

// string to integer using custom charset
function stringToInt(str, charset) {
  const base = Array.from(charset).length
  let result = 0
  for (let i = 0; i < Array.from(str).length; i++) {
    const digit = Array.from(charset).indexOf(Array.from(str)[i])
    if (digit === -1) throw new Error(`Invalid character: ${Array.from(str)[i]}`)
    result = result * base + digit
  }
  return result
}

// integer to string using custom charset
function intToString(num, charset) {
  if (num === 0) return Array.from(charset)[0]
  const base = Array.from(charset).length
  let result = ''
  while (num > 0) {
    const remainder = num % base
    result = Array.from(charset)[remainder] + result
    num = Math.floor(num / base)
  }
  return result
}

export function wordFromSecond(words, second, cycleLength, string = BASE36_CHARS) {
  const cycles = words.length * 3
  const stage = Math.floor((second / cycleLength) * cycles) % cycles
  const fromLastStage = (second / cycleLength * cycles) % 1
  const oldInd = mod(Math.floor(stage / 3), words.length)

  // handle static stage
  if (stage % 3 < 2) {
    return words[oldInd]
  }

  // extract raw strings
  const stripCartouche = str => {
    if (str.startsWith('󱦐') && str.endsWith('󱦑')) {
      return Array.from(str).slice(1, -1)
    }
    return str
  }

  const addCartouche = (str, original) => {
    if (original.startsWith('󱦐') && original.endsWith('󱦑')) {
      return `󱦐${str}󱦑`
    }
    return str
  }

  const oldRaw = stripCartouche(words[oldInd])
  const newInd = mod(oldInd + 1, words.length)
  const newRaw = stripCartouche(words[newInd])

  const oldInt = stringToInt(oldRaw, string)
  const newInt = stringToInt(newRaw, string)
  const interpolated = Math.round((newInt / oldInt) ** fromLastStage * oldInt)
  const interpolatedStr = intToString(interpolated, string)

  return addCartouche(interpolatedStr, words[oldInd])
}

export function oneTimeWordFromSecond([oldStr, newStr], second, cycleLength, string=BASE36_CHARS) {
  if (!oldStr) {
    return newStr
  }
  const progress = Math.min(second / cycleLength, 1) // clamp at 1.0
  const old = stringToInt(oldStr, string)
  const next = stringToInt(newStr, string)
  const current = Math.round((next / old) ** progress * old) 
  return intToString(current, string)
}

