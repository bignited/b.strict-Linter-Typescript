# bstrict/no-unnecessary-waiting-playwright

**Description:** Disallow unnecessary waiting with numeric values in Playwright tests.

## Rule Details

This rule prevents the use of `page.waitForTimeout()` with numeric durations, such as `page.waitForTimeout(5000)`.
Time-based waits make tests slower, inconsistent, and dependent on arbitrary delays instead of real application signals.

Playwright recommends waiting on selectors, events, or conditions, such as `page.waitForSelector()` or `page.waitForLoadState()`.
These approaches produce faster, more stable, and more predictable tests.

Numeric waits are allowed only when preceded by a full-line comment, making intentional temporary waits explicitly documented during debugging.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-unnecessary-waiting-playwright': 'warn'
}
```

## Examples

❌ Don't

```ts
page.waitForTimeout(5000);

const delay = 500;
page.waitForTimeout(delay);
```

✅ Do

```ts
await page.waitForSelector("#done");
await page.waitForLoadState("networkidle");
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.`

[⬅ Back to Rules](../../README.md#rules)
