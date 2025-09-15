/**
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
 */

export const recommended = {
  plugins: ["bstrict", "@stylistic"],
  rules: {
    // Using the ESLint recommended rules by b.ignited
    "@stylistic/indent": ["error", 2],
    complexity: ["error", 2],
    "max-depth": ["error", 2],
    "max-lines": "error",
    "no-irregular-whitespace": "error",
    "no-prototype-builtins": "off",
    "@stylistic/no-multi-spaces": "error",
    "prefer-const": "off",
    "@stylistic/space-before-function-paren": "off",
    "@stylistic/quotes": ["error", "single", { avoidEscape: true }],
    "arrow-body-style": ["error", "always"],
    "@stylistic/no-explicit-any": "off",

    // Using the rules defined in the eslint-plugin-bstrict plugin
    "bstrict/max-function-size": ["warn", 15],
    "bstrict/no-unnecessary-waiting-cypress": "error",
    "bstrict/no-unnecessary-waiting-playwright": "error",
    "bstrict/no-force": "error",
    "bstrict/no-pause-cypress": "error",
  },
};
