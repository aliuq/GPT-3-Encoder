# GPT-3-Encoder

Javascript BPE Encoder Decoder for GPT-2 / GPT-3

Forked from [latitudegames/GPT-3-Encoder](https://github.com/latitudegames/GPT-3-Encoder)

Differences from the original repository:

+ By default, the encoder.json and vocab.bpe files are included in the package, which makes the file size very large.
+ It is possible to provide a CDN file address to load the files.

## Usage

default

```ts
import { decode, encode } from '@aliuq/gpt-3-encoder'

encode(str)
decode(tokens)
```

fetch

encode/decode need an another parameter `options`, which is an object with the following properties:

+ `encoder`: the path of encoder.json file
+ `bpe`: the path of vocab.bpe file

```ts
import { decode, encode } from '@aliuq/gpt-3-encoder/fetch'

const options = {
  encoder: 'https://unpkg.com/@aliuq/gpt-3-encoder/dist/encoder.json',
  bpe: 'https://unpkg.com/@aliuq/gpt-3-encoder/dist/vocab.bpe',
}

encode(str, options)
decode(tokens, options)
```

also, you can copy the files to your own server and use them.
