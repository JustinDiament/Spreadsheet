
// export default {
//   "reporters": ["./reporters/jest-json-reporter.js"],
//   "roots": ["<rootDir>/src"],
//   "transform": {
//     "^.+\\.tsx?$": "ts-jest"
//   },
//   "testRegex": ["(/__tests__/.*|(\\.|/)(e2e))\\.ts$"],
//   "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
//   watchAll: false,
//   testTimeout: 30_000
// }
// export default {
//   preset: "jest-puppeteer",
//   testMatch: ["**/*.test.ts", "**/*.spec.ts"],
//   verbose: true,
//   "roots": ["<rootDir>/src"],
//   "transform": {
//     "^.+\\.tsx?$": "ts-jest"
//   },
  
//   "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
//   testTimeout: 30_000
// };
//   testMatch: ["**/*.test.ts", "**/*.spec.ts"],

export default {
  "reporters": ["./reporters/jest-json-reporter.js"],
  "roots": ["<rootDir>/src"],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
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
