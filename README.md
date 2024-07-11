# bstrict ESLint Plugin

An [ESLint](https://eslint.org) plugin for [b.ignited](https://bignited.be).

## Table Of Contents
1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Usage](#usage)

## Requirements

[ESLint](https://www.npmjs.com/package/eslint) `v8` or `v9`.
This plugin supports the use of [Flat config files](https://eslint.org/docs/latest/use/configure/configuration-files) with ESLint `8.57.0` and above.

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

If you are using ESLint `v7` or `v8`, then add an `.eslintrc.json` file to the root directory of your project with the contents shown below. If you are using ESLint `v9`, then to continue using this format you need to set the `ESLINT_USE_FLAT_CONFIG` environment variable to `false` (see [ESLint v9 > Configuration Files (Deprecated)](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated). However this configuration system is planned to be removed in ESLint `10.0.0`.

ESLint `v9` and above uses a [Flat config file](https://eslint.org/docs/latest/use/configure/configuration-files) format with filename `eslint.config.*js` by default. Please refer to [Flat config](#eslint-v9-or-above). (You may also use this with ESLint `8.57.0`.)

```json
{
  "plugins": [
    "bstrict"
  ]
}
```

You can add rules individually:

```json
{
  "rules" : {
      "bstrict/max-function-size": ["warn", 15],
      "bstrict/no-unnecessary-waiting": "error"
  }
}
```

We also provide a recommended configuration so you can forego configuring _plugins_, _rules_ individually. See [recommended rules](#recommended-configuration) for which rules are included.

```json
{
  "extends": [
    "plugin:bstrict/recommended"
  ]
}
```

### ESLint `v9` or above

If you want to use ESLint `v9` or above with [Flat config file](https://eslint.org/docs/latest/use/configure/configuration-files), then add an `eslint.config.js` file to the root directory of your project with the contents shown below.

```js
import pluginBstrict from 'eslint-plugin-bstrict/flat'
```

Since we now have the flat configurations available you can add rules individually:

```js
export default [
  {
    plugins: {
      bstrict: pluginBstrict
    },
    rules: {
      'bstrict/max-function-size': ['warn', 15],
      'bstrict/no-unnecessary-waiting': 'error'
    }
  }
]
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

| Name                  | Description | Configuration |
|:----------------------|:------------|:--------------|
|