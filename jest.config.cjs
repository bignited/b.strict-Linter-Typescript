/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testMatch: ["**/test/**/*.test.ts"],
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
    "^.+\\.js$": ["ts-jest", { useESM: true }],
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testPathIgnorePatterns: [
    "/.history/",
    ...require("jest-config").defaults.testPathIgnorePatterns,
  ],
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
