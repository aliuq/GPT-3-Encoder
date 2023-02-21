export const range = (x: number, y: number) => {
  return Array.from(Array(y).keys()).slice(x)
}

export const ord = (x: string) => {
  return x.charCodeAt(0)
}

export const chr = (x: any) => {
  return String.fromCharCode(x)
}

export const textEncoder = new TextEncoder()

export const encodeStr = (str: string) => {
  return Array.from(textEncoder.encode(str)).map(x => x.toString())
}

export const textDecoder = new TextDecoder('utf-8')

export const decodeStr = (arr: any) => {
  return textDecoder.decode(new Uint8Array(arr))
}

export const dictZip = (keys: any, values: any) => {
  const result: Record<any, any> = {}
  keys.forEach((_: any, i: string | number) => {
    result[keys[i]] = values[i]
  })
  return result
}

export function bytes_to_unicode() {
  const bs = range(ord('!'), ord('~') + 1).concat(range(ord('¡'), ord('¬') + 1), range(ord('®'), ord('ÿ') + 1))

  let cs: any[] = bs.slice()
  let n = 0
  for (let b = 0; b < 2 ** 8; b++) {
    if (!bs.includes(b)) {
      bs.push(b)
      cs.push(2 ** 8 + n)
      n = n + 1
    }
  }

  cs = cs.map(x => chr(x))

  const result: Record<any, any> = {}
  bs.forEach((_, i) => {
    result[bs[i]] = cs[i]
  })
  return result
}

export function get_pairs(word: string | any[]) {
  const pairs = new Set()
  let prev_char = word[0]
  for (let i = 1; i < word.length; i++) {
    const char = word[i]
    pairs.add([prev_char, char])
    prev_char = char
  }
  return pairs
}

export const pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu
