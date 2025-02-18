/* eslint-disable no-console */
import { decode, encode } from './dist/index.mjs'

const str = 'This is an example sentence to try encoding out on!'
const encoded = encode(str)
console.log('Encoded this string looks like: ', encoded)

console.log('We can look at each token and what it represents')
for (const token of encoded)
  console.log({ token, string: decode([token]) })

const decoded = decode(encoded)
console.log('We can decode it back into:\n', decoded)
