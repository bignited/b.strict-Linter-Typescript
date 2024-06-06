/** 
 * @fileoverview Legacy ESLint plugin with bstrict rules.
 * @author b.ignited
*/

const recommended = require('./lib/config/recommended');
const maxFunctionSizeRule = require('./rules/max-function-size');
const noUnnecessaryWaitingRule = require('./rules/no-unnecessary-waiting');

module.exports = {
  rules: {
    'max-function-size': maxFunctionSizeRule,
    'no-unnecessary-waiting': noUnnecessaryWaitingRule
  },
  configs: {
    recommended: require('./lib/config/recommended'),
  },
  environments: {
    globals: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      }
    }
  }
}