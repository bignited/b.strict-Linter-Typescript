/** 
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
*/
'use strict';

const maxFunctionSizeRule = require('./rules/max-function-size');
const noUnnecessaryWaitingRule = require('./rules/no-unnecessary-waiting');
const plugin = {
  rules: {
    'max-function-size': maxFunctionSizeRule,
    'no-unnecessary-waiting': noUnnecessaryWaitingRule
  }
};
module.exports = plugin;