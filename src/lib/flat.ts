import maxFunctionSize from "./rules/max-function-size.js";
import noForce from "./rules/no-force.js";
import noPause from "./rules/no-pause.js";
import noUnnecessaryWaiting from "./rules/no-unnecessary-waiting.js";
import noPrint from "./rules/no-print.js";
import { name, version } from "../../package.json";
import globals from "globals";
import { TSESLint } from "@typescript-eslint/utils";
import stylistic from "@stylistic/eslint-plugin";

/**
 * @fileoverview ESLint plugin with bstrict rules.
 * @author b.ignited
 */

const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  "max-function-size": maxFunctionSize,
  "no-force": noForce,
  "no-pause": noPause,
  "no-unnecessary-waiting": noUnnecessaryWaiting,
  "no-print": noPrint,
};

const commonGlobals: Record<string, boolean> = {
  cy: false,
  Cypress: false,
  expect: false,
  assert: false,
  chai: false,
  ...globals.browser,
  ...globals.mocha,
};

const plugin = {
  name: "bstrict",
  meta: { name, version },
  rules,
  configs: {
    globals: {
      plugins: {
        bstrict: { rules },
      },
      languageOptions: {
        globals: commonGlobals,
      },
    },
    recommended: {
      name: "bstrict/recommended",
      plugins: {
        bstrict: { rules },
        "@stylistic": stylistic,
      },
      languageOptions: {
        globals: commonGlobals,
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

        // Using the rules defined in the eslint-plugin-bstrict plugin
        "bstrict/max-function-size": ["warn", 15],
        "bstrict/no-unnecessary-waiting": "error",
        "bstrict/no-force": "error",
        "bstrict/no-pause": "error",
        "bstrict/no-print": "error",
      },
    },
  },
};

module.exports = plugin;
