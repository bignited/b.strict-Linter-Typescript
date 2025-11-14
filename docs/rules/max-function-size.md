# bstrict/max-function-size

**Description:** Enforce a maximum function size.

## Rule Details

This rule aims to improve code readability and maintainability by discouraging functions that are excessively long or perform too many tasks.
Large functions are harder to test, reuse, and reason about. By keeping functions short and focused, your code becomes easier to understand and maintain.

## Configuration

### Options

| Option               | Type       | Default                                                                                                        | Description                                                                             |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `maxLines`           | `number`   | `15`                                                                                                           | The maximum number of lines allowed inside a function body.                             |
| `callbackIgnores`    | `string[]` | `["describe", "context", "it", "test", "before", "beforeEach", "beforeAll", "after", "afterEach", "afterAll"]` | Names of functions whose callbacks should be ignored (typically test framework blocks). |
| `declarationIgnores` | `string[]` | `-`                                                                                                            | Names of standalone or variable-declared functions to ignore.                           |
| `methodIgnores`      | `string[]` | `-`                                                                                                            | Names of class methods to ignore.                                                       |

### Example Configuration

```ts
rules: {
    'bstrict/max-function-size': [
        'warn',
        {
            maxLines: 20,
            declarationIgnores: ['createMockItems'],
            methodIgnores: ['constructor']
        }
    ]
}
```

## Examples

❌ Don't

```ts
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    if (item.discount) {
      total += item.price - item.price * item.discount;
    } else {
      total += item.price;
    }
  }
  console.log("Items processed:", items.length);
  console.log("Final total:", total);
  saveToDatabase(total);
  sendAnalytics(items, total);
  notifyUser(total);
  updateUI(total);
  return total;
}
```

✅ Do

```ts
function calculateTotal(items) {
  return items.reduce((sum, item) => {
    const price = item.discount
      ? item.price - item.price * item.discount
      : item.price;
    return sum + price;
  }, 0);
}

function finalizeCheckout(items) {
  const total = calculateTotal(items);
  saveToDatabase(total);
  notifyUser(total);
}
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](../../README.md#rules)
