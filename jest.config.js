/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: "node",
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    ".scannerwork/",
    ".env",
    "/dist",
  ],
  testMatch: ["**/__tests__/**/*.(test).[jt]s?(x)"],
};