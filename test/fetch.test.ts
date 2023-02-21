import { expect, test } from 'vitest'
import type { Options } from '../src/fetch'
import { decode, encode } from '../src/fetch'

const options: Options = {
  // Maybe faster in github actions
  bpe: 'https://raw.githubusercontent.com/aliuq/GPT-3-Encoder/master/src/assets/vocab.bpe',
  encoder: 'https://raw.githubusercontent.com/aliuq/GPT-3-Encoder/master/src/assets/encoder.json',
}

test('empty string', async () => {
  const str = ''
  expect(await encode(str, options)).toEqual([])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})

test('space', async () => {
  const str = ' '
  expect(await encode(str, options)).toEqual([220])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})

test('tab', async () => {
  const str = '\t'
  expect(await encode(str, options)).toEqual([197])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})

test('simple text', async () => {
  const str = 'This is some text'
  expect(await encode(str, options)).toEqual([1212, 318, 617, 2420])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})

test('multi-token word', async () => {
  const str = 'indivisible'
  expect(await encode(str, options)).toEqual([521, 452, 12843])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})

test('emojis', async () => {
  const str = 'hello 👋 world 🌍'
  expect(await encode(str, options)).toEqual([31373, 50169, 233, 995, 12520, 234, 235])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})

test('properties of Object', async () => {
  const str = 'toString constructor hasOwnProperty valueOf'

  expect(await encode(str, options)).toEqual([1462, 10100, 23772, 468, 23858, 21746, 1988, 5189])
  expect(await decode(await encode(str, options), options)).toEqual(str)
})
