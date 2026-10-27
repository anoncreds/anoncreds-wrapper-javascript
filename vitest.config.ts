import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Test the packages from source, like the paths in tsconfig.json
    alias: [{ find: /^@hyperledger\/(.*)$/, replacement: path.resolve(__dirname, 'packages/$1/src') }],
  },
  test: {
    testTimeout: 20000,
    watch: false,
    setupFiles: ['packages/anoncreds-nodejs/tests/setup.ts', 'packages/anoncreds-shared/tests/setup.ts'],
  },
})
