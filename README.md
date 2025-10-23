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

- [ESLint](https://www.npmjs.com/package/eslint) `v9` or higher.
  This plugin supports **Flat Config files** (`eslint.config.*js`) introduced in ESLint 9+.

- [Stylistic](https://www.npmjs.com/package/@stylistic/eslint-plugin) `v5.4.0` or higher.
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

This will create a `eslint.config.*js` with default values.

Now you can just import `bstrict` into `eslint.config.*js` and add the desired preset.

More info on available presets / rules [here](#rules)

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import bstrict from "eslint-plugin-bstrict";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  bstrict.configs.recommended, // or .cypress or .playwright instead of .recommended
  tseslint.configs.recommended,
]);
```

## Advanced Usage

If you need fine-grained control:

### Select specific rules only

When you dont need a preset but just a particular set of rules, make sure to also import `stylistic` and add both plugins to the `plugins` property + add the desired preset / rules to the `rules` property.

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import bstrict from "eslint-plugin-bstrict";
import stylistic from "@stylistic/eslint-plugin"; // import stylistic

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js: js, bstrict: bstrict, "@stylistic": stylistic }, // add plugins
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      // add the desired specific rules here
      "bstrict/max-function-size": "warn",
      "bstrict/no-print": "warn",
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
      ...bstrict.configs.recommended.rules, // important!, first declare the rules
      "@stylistic/indent": "off", // and THEN overwrite it
    },
  },
  tseslint.configs.recommended,
]);
```

## Disable rules

You can disable specific rules per file, for a portion of the file or more.

### Examples:

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

It is also possible to ignore the rule by placing a full-line comment right above them. The plugin will treat that as an explanation to the piece of code:

```js
// A force here is necessary because X.
cy.get("selector").click({ force: true }); // No warning
```

For more, see the [ESLint rules](https://eslint.org/docs/user-guide/configuring/rules) documentation.

## Rules

All following rules are within recommended configuration

**Both `cypress` and `playwright` rules have the `recommended` rules included**

### ESLint rules

| Rule Name                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Configuration                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Fixable by code                  | Included in   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------- |
| max-function-size                 | Enforce a maximum function size.                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **maxLines**: `number` The maximum number of lines allowed inside a function body. (default is `15`)<br> **callbackIgnores**: `string[]` Names of functions whose callbacks should be ignored (typically test framework blocks). (default is `["describe", "context", "it", "test", "before", "beforeEach", "beforeAll", "after", "afterEach", "afterAll"]`)<br> **declarationIgnores**: `string[]` Names of standalone or variable-declared functions to ignore. (default is `[]`)<br> **methodIgnores**: `string[]` Names of class methods to ignore. (default is `[]`) | no                               | `recommended` |
| no-force                          | Disallow using `force: true` with action commands.                                                                                                                                                                                                                                                                                                                                                                                                                                      | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | yes - removes the force argument | `recommended` |
| no-print                          | Disallow print/debug statements like `console.log`, `alert`, etc.                                                                                                                                                                                                                                                                                                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | yes- removes the print statement | `recommended` |
| no-control-flow-in-assert         | Disallow using control flow statements inside assert blocks                                                                                                                                                                                                                                                                                                                                                                                                                             | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `recommended` |
| no-chained-traversal              | Disallow using 2 or more chained HTML traversal methods in a single selector                                                                                                                                                                                                                                                                                                                                                                                                            | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `recommended` |
| no-pause-cypress                  | Disallow using `cy.pause()` in Cypress tests.                                                                                                                                                                                                                                                                                                                                                                                                                                           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `cypress`     |
| no-unnecessary-waiting-cypress    | Disallow unnecessary waiting with numeric values in Cypress tests.                                                                                                                                                                                                                                                                                                                                                                                                                      | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `cypress`     |
| one-assert-per-test-cypress       | Limits the amount of `direct` asserts within a Cypress test block. **Important:** If asserts are done indirectly (from a Page Object for example) these will not be counted towards the limit.                                                                                                                                                                                                                                                                                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `cypress`     |
| no-poor-html-selector-cypress     | Disallow using poor HTML selectors in Cypress. <br> A poor selector is considered one of: <br> - **Has Multiple Traversal Combinators**. Example: cy.get('div > li > a') <br> - **Is Deep Xpath**. Example: cy.get('//div/ul/li/a') <br> - **Uses Nth Child**. Example: cy.get('ul li:nth-child(3)') <br> - **Randomized Class**. Example: cy.get('.card-123abc') <br> - **Framework Class** (like bootstrap). Example cy.get('.btn.btn-primary') <br>                                  | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `cypress`     |
| no-unnecessary-waiting-playwright | Disallow unnecessary waiting in Playwright tests.                                                                                                                                                                                                                                                                                                                                                                                                                                       | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `playwright`  |
| one-assert-per-test-playwright    | Limits the amount of `direct` asserts within a Cypress test block. **Important:** If asserts are done indirectly (from a Page Object for example) these will not be counted towards the limit.                                                                                                                                                                                                                                                                                          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `playwright`  |
| no-poor-html-selector-playwright  | Disallow using poor HTML selectors in Playwright. <br> A poor selector is considered one of: <br> - **Has Multiple Traversal Combinators**. Example: page.locator('div > li > a') <br> - **Is Deep Xpath**. Example: page.locator('//div/ul/li/a') <br> - **Uses Nth Child**. Example: page.locator('ul li:nth-child(3)') <br> - **Randomized Class**. Example: page.locator('.card-123abc') <br> - **Framework Class** (like bootstrap). Example page.locator('.btn.btn-primary') <br> | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | no                               | `playwright`  |

## Running Eslint

Run you linter with

```bash
npx eslint .
```
