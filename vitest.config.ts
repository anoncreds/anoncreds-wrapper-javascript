import viteTsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    testTimeout: 10000,
    watch: false,
    setupFiles: ['packages/anoncreds-nodejs/tests/setup.ts'],
  },
})
