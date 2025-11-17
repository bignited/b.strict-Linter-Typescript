# bstrict/no-force

**Description:** Disallow using `force: true` with action commands.

## Rule Details

This rule disallows the use of the `{ force: true }` option in Cypress commands (or similar testing APIs).
Using `{ force: true }` bypasses built-in visibility and actionability checks, leading to brittle and unreliable tests that may pass even when the UI isn’t behaving correctly.

The rule ensures tests interact with elements the same way a real user would, by waiting for elements to be visible, enabled, and ready before performing actions.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-force': ['warn']
}
```

## Examples

❌ Don't

```ts
cy.get("button").click({ force: true });
```

✅ Do

```ts
cy.get("button").click();
```

## Fixable by code

✅ - Remove all force arguments when running `--fix`.

[⬅ Back to Rules](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/README.md#rules)
