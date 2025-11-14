# bstrict/one-assert-per-test-cypress

**Description:** Limits the amount of direct asserts within a Cypress test block. **_Important_**: If asserts are done indirectly (from a Page Object for example) these will not be counted towards the limit.

## Rule Details

This rule ensures that each Playwright test contains no more than one assertion.
Tests with multiple assertions often mix concerns, making failures harder to diagnose and reducing test clarity.

By limiting each test to a single assertion, you encourage:

- Clearer test intent
- More focused test cases
- Easier debugging when a test fails
- Better alignment with the “one expectation per test” philosophy

The rule allows tests with zero or one assertion, and it also allows tests with multiple assertions when they are preceded by a full-line comment, which acknowledges intentional deviation for specific purposes.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/one-assert-per-test-cypress': 'warn'
}
```

## Examples

❌ Don't

```ts
it("two expect assertions", () => {
  expect(true).to.be.true;
  expect(false).to.be.false;
});

it("expect and should", () => {
  expect(true).to.be.true;
  cy.get("button").should("be.visible");
});

it("multiple nested assertions", () => {
  if (true) {
    expect(true).to.be.true;
    cy.get("button").should("be.visible");
  }
});
```

✅ Do

```ts
it("single expect assertion", () => {
  expect(true).to.be.true;
});

it("single should assertion", () => {
  cy.get("button").should("be.visible");
});

it("no assertions", () => {
  const a = 1 + 2;
});
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](https://github.com/bignited/b.strict-Linter-Javascript/blob/develop/README.md#rules)
