import { createRequire } from "module";
import globals from "globals";
import { TSESLint } from "@typescript-eslint/utils";
import stylistic from "@stylistic/eslint-plugin";
import maxFunctionSize from "./rules/max-function-size.js";
import noForce from "./rules/no-force.js";
import noPauseCypress from "./rules/no-pause-cypress.js";
import noUnnecessaryWaitingCypress from "./rules/no-unnecessary-waiting-cypress.js";
import noUnnecessaryWaitingPlaywright from "./rules/no-unnecessary-waiting-playwright.js";
import noPrint from "./rules/no-print.js";
import oneAssertPerTestCypress from "./rules/one-assert-per-test-cypress.js";
import oneAssertPerTestPlaywright from "./rules/one-assert-per-test-playwright.js";
import noControlFlowInAssert from "./rules/no-control-flow-in-assert.js";
import noChainedTraversal from "./rules/no-chained-traversal.js";
import noPoorHtmlSelectorCypress from "./rules/no-poor-html-selector-cypress.js";
import noPoorHtmlSelectorPlaywright from "./rules/no-poor-html-selector-playwright.js";

/**
 * @fileoverview ESLint plugin with b.strict rules.
 * @author b.ignited
 */

const baseRules = {
  // External base rules
  "@stylistic/indent": ["error", 2],
  "@stylistic/space-before-function-paren": "off",
  "@stylistic/quotes": ["error", "single", { avoidEscape: true }],
  "@stylistic/no-multi-spaces": "error",
  complexity: ["error", 2],
  "max-depth": ["error", 2],
  "max-lines": "error",
  "no-irregular-whitespace": "error",
  "no-prototype-builtins": "off",
  "prefer-const": "off",
  "arrow-body-style": ["error", "always"],

  // Plugin base rules
  "bstrict/max-function-size": "warn",
  "bstrict/no-force": "warn",
  "bstrict/no-print": "warn",
  "bstrict/no-control-flow-in-assert": "warn",
  "bstrict/no-chained-traversal": "warn",
};

const rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>> = {
  "max-function-size": maxFunctionSize,
  "no-force": noForce,
  "no-pause-cypress": noPauseCypress,
  "no-unnecessary-waiting-cypress": noUnnecessaryWaitingCypress,
  "no-unnecessary-waiting-playwright": noUnnecessaryWaitingPlaywright,
  "no-print": noPrint,
  "one-assert-per-test-cypress": oneAssertPerTestCypress,
  "one-assert-per-test-playwright": oneAssertPerTestPlaywright,
  "no-control-flow-in-assert": noControlFlowInAssert,
  "no-chained-traversal": noChainedTraversal,
  "no-poor-html-selector-cypress": noPoorHtmlSelectorCypress,
  "no-poor-html-selector-playwright": noPoorHtmlSelectorPlaywright,
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

const basePluginsAndLanguageOptions = {
  plugins: {
    bstrict: { rules },
    "@stylistic": stylistic,
  },
  languageOptions: {
    globals: commonGlobals,
  },
};

const recommended = {
  name: "bstrict/recommended",
  ...basePluginsAndLanguageOptions,
  rules: baseRules,
};

const cypress = {
  name: "bstrict/cypress",
  ...basePluginsAndLanguageOptions,
  rules: {
    ...baseRules,
    "bstrict/no-unnecessary-waiting-cypress": "warn",
    "bstrict/no-pause-cypress": "warn",
    "bstrict/one-assert-per-test-cypress": "warn",
    "bstrict/no-poor-html-selector-cypress": "warn",
  },
};

const playwright = {
  name: "bstrict/playwright",
  ...basePluginsAndLanguageOptions,
  rules: {
    ...baseRules,
    "bstrict/no-unnecessary-waiting-playwright": "warn",
    "bstrict/one-assert-per-test-playwright": "warn",
    "bstrict/no-poor-html-selector-playwright": "warn",
  },
};

const myRequire = createRequire(import.meta.url);
const pkg = myRequire("../../package.json");

export default {
  name: "bstrict",
  meta: { name: pkg.name, version: pkg.version },
  rules,
  configs: {
    recommended,
    cypress,
    playwright,
  },
};
