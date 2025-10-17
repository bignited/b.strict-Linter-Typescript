# bstrict ESLint Plugin

An [ESLint](https://eslint.org) plugin for [b.ignited](https://bignited.be).

## Table Of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Quickstart](#quickstart)
4. [Advanced Usage](#advanced-usage)
   1. [Select specific rules only](#select-specific-rules-only)
   2. [Override rules](#override-rules)
5. [Disable Rules](#disable-rules)
6. [Rules](#rules)
7. [Running ESLint](#running-eslint)

## Requirements

- [ESLint](https://www.npmjs.com/package/eslint) `v9` or higher  
  This plugin supports **Flat Config files** (`eslint.config.*js`) introduced in ESLint 9+.

- [Stylistic](https://www.npmjs.com/package/@stylistic/eslint-plugin) `v5.4.0` or higher
  This plugin uses `@stylistic/eslint-plugin` rules on top of our own custom rules.

## Installation

```sh
npm install --save-dev eslint-plugin-bstrict
```

or

```sh
yarn add --dev eslint-plugin-bstrict
```

## Quickstart

This plugin ships with ready-to-use flat config presets so you can get started immediately.

**Note:** If its the first time using eslint (or dont have an eslint.config.\*js file already) run:

```sh
npx eslint --init
```

Now you can just import `bstrict` and `stylistic` into `eslint.config.mjs` Make sure to add them as `plugins` + add the desired preset / rules to the `rules`

More info on available presets / rules [here](#rules)

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import bstrict from "eslint-plugin-bstrict";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js: js, bstrict: bstrict, "@stylistic": stylistic },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      ...bstrict.configs.recommended.rules, // or playwright.rules or cypress.rules
    },
  },
  tseslint.configs.recommended,
]);
```

## Advanced Usage

If you need fine-grained control:

### Select specific rules only

When you dont need a preset but just a particular set of rules:

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import bstrict from "eslint-plugin-bstrict";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js: js, bstrict: bstrict, "@stylistic": stylistic },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "bstrict/max-function-size": ["warn", 20],
      "bstrict/no-print": ["warn"],
    },
  },
  tseslint.configs.recommended,
]);
```

### Override rules

If you need to override a rule within a preset:

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import bstrict from "eslint-plugin-bstrict";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js: js, bstrict: bstrict, "@stylistic": stylistic },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      ...bstrict.configs.recommended.rules,
      "@stylistic/indent": "off",
    },
  },
  tseslint.configs.recommended,
]);
```

## Disable rules

You can disable specific rules per file, for a portion of the file or more.

Disable the `bstrict/max-function-size` rule for the entire file by placing this at the start of the file:

```js
/* eslint-disable bstrict/max-function-size */
```

Disable the `bstrict/max-function-size` rule for only a portion of the file:

```js
/* eslint-disable bstrict/max-function-size */
function foo() {
  ...
}
/* eslint-enable bstrict/max-function-size */
```

It is also possible to ignore the rules by placing a full-line comment right above them. The plugin will treat that as an explanation to the piece of code:

```js
// A force here is necessary because X.
cy.get("selector").click({ force: true });
```

For more, see the [ESLint rules](https://eslint.org/docs/user-guide/configuring/rules) documentation.

## Rules

All following rules are within recommended configuration

**Both `cypress` and `playwright` rules have the `recommended` rules included**

### ESLint rules

| Rule Name                         | Description                                                                                                                                                                                            | Configuration                                                                   | Fixable by code                  | Included in   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------- | ------------- |
| max-function-size                 | Enforce a maximum function size of 15 lines by default.                                                                                                                                                | A numeric value can be passed to customize the maximum number of allowed lines. | no                               | `recommended` |
| no-force                          | Disallow using `force: true` with action commands.                                                                                                                                                     | -                                                                               | yes - removes the force argument | `recommended` |
| no-print                          | Disallow print/debug statements like `console.log`, `alert`, etc.                                                                                                                                      | -                                                                               | yes- removes the print statement | `recommended` |
| no-control-flow-in-assert         | Disallow using control flow statements inside assert blocks                                                                                                                                            | -                                                                               | no                               | `recommended` |
| no-chained-traversal              | Disalow using 2 or more chained HTML traversals in a single selector                                                                                                                                   | -                                                                               | no                               | `recommended` |
| no-pause-cypress                  | Disallow using `cy.pause()` in Cypress tests.                                                                                                                                                          | -                                                                               | no                               | `cypress`     |
| no-unnecessary-waiting-cypress    | Disallow unnecessary waiting with numeric values in Cypress tests.                                                                                                                                     | -                                                                               | no                               | `cypress`     |
| one-assert-per-test-cypress       | Limits the amount of `direct` asserts within a Cypress test block. **Important:** If asserts are done through indirectly (from a Page Object for example) these will not be counted towards the limit. | -                                                                               | no                               | `cypress`     |
| no-unnecessary-waiting-playwright | Disallow unnecessary waiting in Playwright tests.                                                                                                                                                      | -                                                                               | no                               | `playwright`  |
| one-assert-per-test-playwright    | Limits the amount of `direct` asserts within a Cypress test block. **Important:** If asserts are done through indirectly (from a Page Object for example) these will not be counted towards the limit. | -                                                                               | no                               | `playwright`  |

## Running Eslint

Run you linter with

```bash
npx eslint .
```
