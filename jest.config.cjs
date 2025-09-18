/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testMatch: ["**/test/**/*.test.ts"],
  testEnvironment: "node",
};
