# bstrict/one-assert-per-test-playwright

**Description:** Limits the amount of direct asserts within a Playwright test block. **_Important_**: If asserts are done indirectly (from a Page Object for example) these will not be counted towards the limit.

## Rule Details

This rule ensures that each Cypress test contains no more than one assertion.
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
    'bstrict/one-assert-per-test-playwright': 'warn'
}
```

## Examples

❌ Don't

```ts
test("two expects", () => {
  expect(true).toBe(true);
  expect(false).toBe(false);
});

test("multiple nested expects", () => {
  if (true) {
    expect(true).toBe(true);
    expect(false).toBe(false);
  }
});
```

✅ Do

```ts
test("single expect", () => {
  expect(true).toBe(true);
});

test("no assertions", () => {
  const x = 1 + 1;
});

test("nested single expect", () => {
  if (true) {
    expect(false).toBe(false);
  }
});
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

## Included in Presets:

- `recommended`
- `playwright`
