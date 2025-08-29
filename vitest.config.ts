import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['tests/e2e/**', '**/node_modules/**'],
    include: ['tests/unit/**', '**/*.test.ts', '**/*.test.tsx'],
  },
})
