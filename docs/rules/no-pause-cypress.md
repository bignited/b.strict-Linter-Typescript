# bstrict/no-pause-cypress

**Description:** Disallow using `cy.pause()` in Cypress tests.

## Rule Details

This rule disallows the use of `cy.pause()` in Cypress tests.
The `cy.pause()` command stops test execution and waits for manual interaction, useful for debugging, but problematic when left in committed or automated test code.

Leaving `cy.pause()` in a test will cause it to hang indefinitely during CI or headless runs.
This rule helps ensure that all Cypress tests can run unattended and reliably in any environment.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-pause-cypress': ['warn']
}
```

## Examples

❌ Don't

```ts
cy.pause();
```

✅ Do

```ts
// If its really necessary, add a comment on top to explain why
cy.pause();
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/README.md#rules)
