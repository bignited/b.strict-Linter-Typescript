/** 
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
*/
'use strict';

const maxFunctionSizeRule = require('./rules/max-function-size');
const noUnnecessaryWaitingRule = require('./rules/no-unnecessary-waiting');
const noForceRule = require('./rules/no-force');
const { name, version } = require('../package.json');
const stylisticJs = require('@stylistic/eslint-plugin-js');

const plugin = {
  meta: { name, version },
  configs: {},
  rules: {
    'max-function-size': maxFunctionSizeRule,
    'no-unnecessary-waiting': noUnnecessaryWaitingRule,
    'no-force': noForceRule
  }
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      'bstrict': plugin,
      '@stylistic/js': stylisticJs
    },
    rules: {
      // Using the ESLint recommended rules by b.ignited
      '@stylistic/js/indent': ['error', 2],
      complexity: ['error', 2],
      'max-depth': ['error', 2],
      'max-lines': 'error',
      'no-irregular-whitespace': 'error',
      'no-prototype-builtins': 'off',
      '@stylistic/js/no-multi-spaces': 'error',
      'prefer-const': 'off',
      '@stylistic/js/space-before-function-paren': 'off',
      '@stylistic/js/quotes': ['error', 'single', { avoidEscape: true }],
      'arrow-body-style': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',

      // Using the rules defined in the eslint-plugin-bstrict plugin
      'bstrict/max-function-size': ['warn', 15],
      'bstrict/no-unnecessary-waiting': 'error',
      'bstrict/no-force': 'error'
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest'
    }
  }
})
module.exports = plugin;