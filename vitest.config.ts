/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'vitest-plugin-bpe',
      configResolved(config) {
        config.resolve.extensions.push('.bpe')
      },
      transform(code, id) {
        if (id.endsWith('.bpe')) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null,
          }
        }
      },
    },
  ],
  test: {
    testTimeout: 20000,
  },
})
