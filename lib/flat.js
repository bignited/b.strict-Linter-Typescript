/* eslint-disable n/no-unpublished-import */
/** 
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
*/
'use strict';

const globals = require('globals')

const maxFunctionSizeRule = require('./rules/max-function-size');
const noUnnecessaryWaitingRule = require('./rules/no-unnecessary-waiting');
const noForceRule = require('./rules/no-force');
const noPauseRule = require('./rules/no-pause')
const { name, version } = require('../package.json');
const stylistic = require('@stylistic/eslint-plugin');

const plugin = {
  meta: { name, version },
  configs: {},
  rules: {
    'max-function-size': maxFunctionSizeRule,
    'no-unnecessary-waiting': noUnnecessaryWaitingRule,
    'no-force': noForceRule,
    'no-pause': noPauseRule
  }
};

const commonGlobals = 
  Object.assign({
    cy: false,
    Cypress: false,
    expect: false,
    assert: false,
    chai: false,
  }, globals.browser, globals.mocha)

Object.assign(plugin.configs, {
  globals: {
    name: 'bstrict/globals',
    plugins: {
      'bstrict': plugin
    },
    languageOptions: {
      globals:
          commonGlobals,
    }
  }
})

Object.assign(plugin.configs, {
  recommended: {
    name: 'bstrict/recommended',
    plugins: {
      'bstrict': plugin,
      '@stylistic': stylistic
    },
    rules: {
      // Using the ESLint recommended rules by b.ignited
      '@stylistic/indent': ['error', 2],
      complexity: ['error', 2],
      'max-depth': ['error', 2],
      'max-lines': 'error',
      'no-irregular-whitespace': 'error',
      'no-prototype-builtins': 'off',
      '@stylistic/no-multi-spaces': 'error',
      'prefer-const': 'off',
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      'arrow-body-style': ['error', 'always'],
      '@stylistic/no-explicit-any': 'off',

      // Using the rules defined in the eslint-plugin-bstrict plugin
      'bstrict/max-function-size': ['warn', 15],
      'bstrict/no-unnecessary-waiting': 'error',
      'bstrict/no-force': 'error',
      'bstrict/no-pause': 'error'
    },
    languageOptions: {
      globals:
        commonGlobals,
    }
  }
})
module.exports = plugin;