const { defaults } = require('jest-config')

module.exports = {
  testMatch: ['**/test/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '.history'],
}
