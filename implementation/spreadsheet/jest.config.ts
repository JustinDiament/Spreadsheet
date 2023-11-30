
import type { JestConfigWithTsJest } from 'ts-jest'
const config: JestConfigWithTsJest = {
  "reporters": ["./reporters/jest-json-reporter.js"],
  "roots": ["<rootDir>/src"],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
  watchAll: false,
  testTimeout: 30_000,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  }
}
export default config;