const { createDefaultPreset } = require('ts-jest');
const { defaults } = require('jest-config');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
const config = {
  testMatch: ['**/test/**/*.test.ts'],
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '.history'],
  transform: {
    ...tsJestTransformCfg,
  },
};

module.exports = config;