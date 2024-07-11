/** 
 * @fileoverview Legacy ESLint plugin with bstrict rules.
 * @author b.ignited
*/

const maxFunctionSizeRule = require('./lib/rules/max-function-size');
const noUnnecessaryWaitingRule = require('./lib/rules/no-unnecessary-waiting');
const noForceRule = require('./lib/rules/no-force');

module.exports = {
  rules: {
    'max-function-size': maxFunctionSizeRule,
    'no-unnecessary-waiting': noUnnecessaryWaitingRule,
    'no-force': noForceRule
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