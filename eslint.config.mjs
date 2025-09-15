// eslint.config.js
"use strict";

// Import the ESLint plugin
import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginBstrict from "eslint-plugin-bstrict";
import stylistic from "@stylistic/eslint-plugin";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import nodePlugin from "eslint-plugin-n";

export default [
  pluginJs.configs.recommended,
  eslintPlugin.configs["flat/recommended"],
  nodePlugin.configs["flat/recommended-script"],
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
    // Using the eslint-plugin-bstrict plugin defined locally
    plugins: {
      bstrict: eslintPluginBstrict,
      "@stylistic": stylistic,
    },
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

      // Using the ESLint recommended rules by eslint-plugin-eslint-plugin
      "eslint-plugin/require-meta-docs-description": "error",
      "eslint-plugin/meta-property-ordering": "error",
      "eslint-plugin/test-case-property-ordering": "error",

      // Using the ESLint recommended rules by eslint-plugin-n
      "n/no-extraneous-require": ["error", { allowModules: ["jest-config"] }],

      // Using the rules defined in the eslint-plugin-bstrict plugin
      "bstrict/max-function-size": ["warn", 15],
      "bstrict/no-unnecessary-waiting-cypress": "error",
      "bstrict/no-unnecessary-waiting-playwright": "error",
      "bstrict/no-force": "error",
      "bstrict/no-pause-cypress": "error",
    },
  },
];
