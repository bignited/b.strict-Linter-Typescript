# bstrict/no-unnecessary-waiting-cypress

**Description:** Disallow unnecessary waiting with numeric values in Cypress tests.

## Rule Details

This rule prevents the use of `cy.wait()` with numeric time values, such as `cy.wait(100)` or `cy.wait(5000)`.
Time-based waits make tests slower, flaky, and dependent on timing rather than on real application behavior.

Instead of waiting arbitrary amounts of time, Cypress encourages waiting on network aliases, conditions, or built-in retries.
This leads to faster, more stable, and more deterministic tests.

Numeric waits are allowed only when preceded by a full-line comment, which helps document intentional temporary waits during debugging.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-unnecessary-waiting-cypress': 'warn'
}
```

## Examples

❌ Don't

```ts
cy.wait(0);
cy.wait(100);
cy.wait(5000);

const delay = 500;
cy.wait(delay);

cy.get(".item").wait(10);
cy.contains("Submit").wait(20);

function custom(ms = 1) {
  cy.wait(ms);
}
```

✅ Do

```ts
cy.wait("@getUser");
cy.wait(["@getUser", "@getSettings"]);
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/README.md#rules)
