# bstrict ESLint Plugin

An [ESLint](https://eslint.org) plugin for [b.ignited](https://bignited.be).

## Table Of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)

## Requirements

[ESLint](https://www.npmjs.com/package/eslint) `v9`. Lower versions are no longer supported
This plugin supports the use of [Flat config files](https://eslint.org/docs/latest/use/configure/configuration-files) with ESLint `9.0.0` and above.

[Stylistic](https://www.npmjs.com/package/@stylistic/eslint-plugin)
Required since some rules within the recommended come from this package.

## Installation

Easy to use with npm or yarn using following commands:

```sh
npm install --save-dev eslint-plugin-bstrict
```

or

```sh
yarn add --dev eslint-plugin-bstrict
```

## Usage

ESLint `v9` and above uses a [Flat config file](https://eslint.org/docs/latest/use/configure/configuration-files) format with filename `eslint.config.*js` by default. Please refer to [Flat config](#eslint-v9-or-above).

**_Important_**: Merging _languageOptions_
ESLint Flat Config does not deep-merge configuration objects. If you add custom parser options, make sure to merge the plugin's _languageOptions.globals_ manually, or they will be overwritten.

```js
import pluginBstrict from "eslint-plugin-bstrict";
import parser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...pluginBstrict.configs.recommended.languageOptions?.globals,
      },
    },
    plugins: {
      pluginBstrict: pluginBstrict,
      "@stylistic": stylistic,
    },
    rules: pluginBstrict.configs.playwright.rules,
  },
];
```

It is also possible to define individual rules:

```js
import pluginBstrict from "eslint-plugin-bstrict";
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    plugins: {
      bstrict: pluginBstrict,
      "@stylistic":
    },
    rules: {
      "bstrict/max-function-size": ["warn", 15],
      "bstrict/no-unnecessary-waiting-cypress": "error",
    },
  },
];
```

We also provide a recommended and tool-specific configuration so you can forego configuring _plugins_, _rules_ individually. See [recommended rules](#rules) for which rules are included.

```js
export default [
  {
    plugins: {
      bstrict: bstrict,
      "@stylistic": stylistic,
    },
    rules: bstrict.configs.playwright.rules,
  },
];
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

For more, see the [ESLint rules](https://eslint.org/docs/user-guide/configuring/rules) documentation.

## Rules

All following rules are within recommended configuration

**Both `cypress` and `playwright` rules have the `recommended` rules included**

### ESLint rules

| Rule Name                         | Description                                                                                                                                                                                            | Configuration                                                                   | Fixable | Included in   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------- | ------------- |
| max-function-size                 | Enforce a maximum function size of 15 lines by default.                                                                                                                                                | A numeric value can be passed to customize the maximum number of allowed lines. |         | `recommended` |
| no-force                          | Disallow using `force: true` with action commands.                                                                                                                                                     | -                                                                               |         | `recommended` |
| no-print                          | Disallow print/debug statements like `console.log`, `alert`, etc                                                                                                                                       | -                                                                               |         | `recommended` |
| no-pause-cypress                  | Disallow using `cy.pause()` in Cypress tests.                                                                                                                                                          | -                                                                               |         | `cypress`     |
| no-unnecessary-waiting-cypress    | Disallow unnecessary waiting with numeric values in Cypress tests.                                                                                                                                     | -                                                                               |         | `cypress`     |
| one-assert-per-test-cypress       | Limits the amount of `direct` asserts within a Cypress test block. **Important:** If asserts are done through indirectly (from a Page Object for example) these will not be counted towards the limit. | -                                                                               |         | `cypress`     |
| no-unnecessary-waiting-playwright | Disallow unnecessary waiting in Playwright tests.                                                                                                                                                      | -                                                                               |         | `playwright`  |
| one-assert-per-test-playwright    | Limits the amount of `direct` asserts within a Cypress test block. **Important:** If asserts are done through indirectly (from a Page Object for example) these will not be counted towards the limit. | -                                                                               |         | `playwright`  |
