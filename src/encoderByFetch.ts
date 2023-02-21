import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { bytes_to_unicode, decodeStr, dictZip, encodeStr, get_pairs, pat, range } from './utils'

export interface Options {
  /** Encoder json file url */
  encoder: string
  /** Bpe file url */
  bpe: string
}

let bpeFile = ''
let encoder: Record<any, any> | undefined
let bpe_ranks: Record<any, any> | undefined
let decoder: Record<any, any> | undefined
let byte_encoder: Record<any, any> | undefined
let byte_decoder: Record<any, any> | undefined

const cache = new Map()

async function request(url: string, responseType: 'json' | 'text' = 'json') {
  const fn = typeof fetch === 'function'
    ? fetch
    : typeof globalThis?.fetch === 'function'
      ? globalThis.fetch
      : axios

  if (fn === axios) {
    const res = await fn(url, { responseType })
    return (<AxiosResponse>res).data
  }
  else {
    const res = await fn(url)
    if (responseType === 'json')
      return (<Response>res).json()
    else
      return (<Response>res).text()
  }
}

async function encodePrepare(options?: Options) {
  byte_encoder = byte_encoder || bytes_to_unicode()

  if (!encoder && !options?.encoder)
    throw new Error('Please provide encoder json file url')

  if (!encoder && options?.encoder)
    encoder = await request(options.encoder)

  if (!bpeFile && !options?.bpe)
    throw new Error('Please provide bpe file url')

  if (!bpeFile && options?.bpe)
    bpeFile = await request(options.bpe, 'text')

  if (!bpe_ranks) {
    const lines = bpeFile.split('\n')
    const bpe_merges = lines.slice(1, lines.length - 1).map((x: any) => {
      return x.split(/(\s+)/).filter((e: any) => {
        return e.trim().length > 0
      })
    })
    bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length))
  }
}

async function decodePrepare(options?: Pick<Options, 'encoder'>) {
  byte_encoder = byte_encoder || bytes_to_unicode()
  if (!byte_decoder) {
    byte_decoder = byte_decoder || {}
    Object.keys(byte_encoder).forEach((x) => {
      byte_decoder![byte_encoder?.[x]] = x
    })
  }

  if (!encoder && !options?.encoder)
    throw new Error('Please provide encoder json file url')

  if (!encoder && options?.encoder)
    encoder = await request(options.encoder) as Record<any, any>

  if (!decoder) {
    decoder = decoder || {}
    Object.keys(encoder as Record<any, any>).forEach((x) => {
      decoder![encoder?.[x]] = x
    })
  }
}

function bpe(token: string) {
  if (cache.has(token))
    return cache.get(token)

  let word: string | string[] = token.split('')
  let pairs = get_pairs(word)

  if (!pairs)
    return token

  while (true) {
    const minPairs: Record<any, any> = {}
    Array.from(pairs).forEach((pair: any) => {
      const rank = bpe_ranks?.[pair]
      minPairs[(isNaN(rank) ? 10e10 : rank)] = pair
    })

    const bigram = minPairs[Math.min(...Object.keys(minPairs).map((x) => {
      return parseInt(x)
    }))]

    if (!(bigram in bpe_ranks!))
      break

    const first = bigram[0]
    const second = bigram[1]
    let new_word: any[] = []
    let i = 0

    while (i < word.length) {
      const j = word.indexOf(first, i)
      if (j === -1) {
        new_word = new_word.concat(word.slice(i))
        break
      }
      new_word = new_word.concat(word.slice(i, j))
      i = j

      if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
        new_word.push(first + second)
        i = i + 2
      }
      else {
        new_word.push(word[i])
        i = i + 1
      }
    }

    word = new_word
    if (word.length === 1)
      break
    else
      pairs = get_pairs(word)
  }

  word = word.join(' ')
  cache.set(token, word)

  return word
}

export async function encode(text: string, options?: Options): Promise<number[]> {
  await encodePrepare(options)
  let bpe_tokens: any[] = []
  const matches = Array.from(text.matchAll(pat)).map(x => x[0])
  for (let token of matches) {
    token = encodeStr(token).map((x) => {
      return byte_encoder?.[x]
    }).join('')

    const new_tokens = bpe(token).split(' ').map((x: string | number) => encoder?.[x])
    bpe_tokens = bpe_tokens.concat(new_tokens)
  }
  return bpe_tokens
}

export async function decode(tokens: number[], options?: Options): Promise<string> {
  await decodePrepare(options)
  let text = tokens.map((x: number) => decoder?.[x]).join('')
  text = decodeStr(text.split('').map((x: string | number) => byte_decoder?.[x]))
  return text
}
