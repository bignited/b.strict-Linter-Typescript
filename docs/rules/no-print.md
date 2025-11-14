# bstrict/no-print

**Description:** Disallow print/debug statements like `console.log`, `alert`, etc.

## Rule Details

This rule disallows the use of printing or debugging functions such as `console.log`, `console.warn`, `console.error`, `alert`, or `document.write`.
These functions are often used for debugging but should not remain in committed code, as they can cause noisy logs, pop-up interruptions, or unwanted side effects during automated testing.

Instead, use proper logging utilities, test reporters, or error handling mechanisms suited for your environment.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-print': ['warn']
}
```

## Examples

❌ Don't

```ts
console.log("Debug message");
```

✅ Do

```ts
// If its really necessary, add a comment on top to explain why
console.log("Allowed due to preceding comment");
```

## Fixable by code

✅ - Remove all print statements when running `--fix`.

## Included in Presets:

- `recommended`
