# bstrict/no-chained-traversal

**Description:** Disallow using 2 or more chained HTML traversal methods in a single selector.

## Rule Details

This rule disallows chaining multiple DOM traversal or selector traversal methods in a single expression.
Chaining traversals such as .find().parent() or .locator().locator() makes test code harder to maintain, less readable, and more prone to breaking when the DOM structure changes.

The rule applies to both Cypress and Playwright testing frameworks, as well as to standard DOM APIs.

## Configuration

### Options

`-`

### Example Configuration

```ts
rules: {
    'bstrict/no-chained-traversal': ['warn']
}
```

## Examples

❌ Don't

Multiple chained traversals, such as:

- `cy.get('div').find('span').parent()`
- `element.parentNode.childNodes`
- `page.locator('ul').locator('li').locator('a')`
- `document.querySelector('ul').querySelector('li')`

Keeping each traversal separate improves readability and makes it easier to identify which part of the DOM or test target is being interacted with.

✅ Do

A single traversal or query call (e.g. `.find()`, `.parentNode`, `.locator()`, or `.querySelector()`).

Chaining a traversal with an action method (e.g. `.click()`, `.type()`, `.contains()`).

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](../../README.md#rules)
