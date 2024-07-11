/** 
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
*/

'use strict';

module.exports = {
  plugins: ['bstrict'],
  rules: {
    // Using the ESLint recommended rules by b.ignited
    indent: ['error', 2],
    complexity: ['error', 2],
    'max-depth': ['error', 2],
    'max-lines': 'error',
    'no-irregular-whitespace': 'error',
    'no-prototype-builtins': 'off',
    'no-multi-spaces': 'error',
    'prefer-const': 'off',
    'space-before-function-paren': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'arrow-body-style': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'off',

    // Using the rules defined in the eslint-plugin-bstrict plugin
    'bstrict/max-function-size': ['warn', 15],
    'bstrict/no-unnecessary-waiting': 'error',
    'bstrict/no-force': 'error'
  },
};