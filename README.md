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

If you want to use ESLint `v9` or above with [Flat config file](https://eslint.org/docs/latest/use/configure/configuration-files), then add an `eslint.config.js` file to the root directory of your project with the contents shown below.

```js
import pluginBstrict from "eslint-plugin-bstrict";
```

Since we now have the flat configurations available you can add rules individually:

```js
export default [
  {
    plugins: {
      bstrict: pluginBstrict,
    },
    rules: {
      "bstrict/max-function-size": ["warn", 15],
      "bstrict/no-unnecessary-waiting": "error",
    },
  },
];
```

We also provide a recommended configuration so you can forego configuring _plugins_, _rules_ individually. See [recommended rules](#rules) for which rules are included.

```js
export default [
  pluginBstrict.configs.recommended
  {
    rules: {
      // any other rules you want to add.
    }
  }
]
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

### ESLint rules

| Name | Description | Configuration |
| :--- | :---------- | :------------ |

|
