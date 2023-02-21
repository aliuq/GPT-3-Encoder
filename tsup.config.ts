import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    fetch: './src/fetch.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  external: ['axios'],
  publicDir: 'src/assets',
  loader: {
    '.bpe': 'text',
    '.json': 'text',
  },
  outExtension({ format }) {
    return {
      js: format === 'esm'
        ? '.mjs'
        : format === 'cjs'
          ? '.cjs'
          : '.js',
    }
  },
})
