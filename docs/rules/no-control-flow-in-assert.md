# bstrict/no-control-flow-in-assert

**Description:** Disallow using control flow statements inside assert blocks.

## Rule Details

This rule disallows using control-flow statements such as if, else, switch, or loops inside assertion callbacks (e.g. inside expect() or cy.should() functions).
Mixing control flow within assertions makes test behavior harder to predict and can mask failures or introduce inconsistent results.

Assertions should express a single, clear expectation, not contain conditional logic.
Use control flow outside of assertions if you need to branch test logic.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-control-flow-in-assert': ['warn']
}
```

## Examples

❌ Don't

```ts
cy.get("button").should(($btn) => {
  if ($btn.length) {
    expect($btn).to.have.text("Submit");
  }
});
```

✅ Do

```ts
expect(value).toBe(1);

cy.get("button").should(($btn) => expect($btn).to.exist);

if (value) {
  expect(value).toBe(1);
}
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](../../README.md#rules)
