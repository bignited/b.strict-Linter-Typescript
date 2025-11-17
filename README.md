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

**Both `cypress` and `playwright` rules have the `recommended` rules included**

### bstrict rules

| Rule                                                                                                                                                     | Value    | Included in |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| [max-function-size](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/max-function-size.md)                                 | `"warn"` | recommended |
| [no-force](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-force.md)                                                   | `"warn"` | recommended |
| [no-print](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-print.md)                                                   | `"warn"` | recommended |
| [no-control-flow-in-assert](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-control-flow-in-assert.md)                 | `"warn"` | recommended |
| [no-chained-traversal](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-chained-traversal.md)                           | `"warn"` | recommended |
| [no-pause-cypress](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-pause-cypress.md)                                   | `"warn"` | cypress     |
| [no-unnecessary-waiting-cypress](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-unnecessary-waiting-cypress.md)       | `"warn"` | cypress     |
| [one-assert-per-test-cypress](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/one-assert-per-test-cypress.md)             | `"warn"` | cypress     |
| [no-poor-html-selector-cypress](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-poor-html-selector-cypress.md)         | `"warn"` | cypress     |
| [no-unnecessary-waiting-playwright](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-unnecessary-waiting-playwright.md) | `"warn"` | playwright  |
| [one-assert-per-test-playwright](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/one-assert-per-test-playwright.md)       | `"warn"` | playwright  |
| [no-poor-html-selector-playwright](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/no-poor-html-selector-playwright.md)   | `"warn"` | playwright  |

### external rules

These are baseline rules we enforce across all test automation projects. Therefore they are included in **every** preset.

They reflect our company-wide standards for code quality, readability, and maintainability.

All external rules can be overridden or reconfigured in your local ESLint setup, just like the rules from this plugin.

| Rule                                                                                             | Value                                          | Source      |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ----------- |
| [@stylistic/indent](https://eslint.style/rules/indent)                                           | `["error", 2]`                                 | Stylistic   |
| [@stylistic/space-before-function-paren](https://eslint.style/rules/space-before-function-paren) | `"off"`                                        | Stylistic   |
| [@stylistic/quotes](https://eslint.style/rules/quotes)                                           | `["error", "single", { "avoidEscape": true }]` | Stylistic   |
| [@stylistic/no-multi-spaces](https://eslint.style/rules/no-multi-spaces)                         | `"error"`                                      | Stylistic   |
| [complexity](https://eslint.org/docs/latest/rules/complexity)                                    | `["error", 2]`                                 | ESLint Core |
| [max-depth](https://eslint.org/docs/latest/rules/max-depth)                                      | `["error", 2]`                                 | ESLint Core |
| [max-lines](https://eslint.org/docs/latest/rules/max-lines)                                      | `"error"`                                      | ESLint Core |
| [no-irregular-whitespace](https://eslint.org/docs/latest/rules/no-irregular-whitespace)          | `"error"`                                      | ESLint Core |
| [no-prototype-builtins](https://eslint.org/docs/latest/rules/no-prototype-builtins)              | `"off"`                                        | ESLint Core |
| [prefer-const](https://eslint.org/docs/latest/rules/prefer-const)                                | `"off"`                                        | ESLint Core |
| [arrow-body-style](https://eslint.org/docs/latest/rules/arrow-body-style)                        | `["error", "always"]`                          | ESLint Core |

## Running Eslint

Run the linter with:

```bash
npx eslint .
```

## Feedback & Suggestions

Your feedback helps shape this project!
Whether it's a new rule idea, a bug you’ve discovered, or thoughts on how to improve the plugin, we’d love to hear from you.

**Contact:**
<devops@bignited.be>
