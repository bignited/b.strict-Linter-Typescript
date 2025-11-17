# bstrict/no-poor-html-selector-playwright

**Description:** Disallow using poor HTML selectors in Playwright.
A poor selector is considered one of:

- **_Has Multiple Traversal Combinators_**. Example: `page.locator('div > li > a')`
- **_Is Deep Xpath_**. Example: `page.locator('//div/ul/li/a')`
- **_Uses Nth Child_**. Example: `page.locator('ul li:nth-child(3)')`
- **_Randomized Class_**. Example: `page.locator('.card-123abc')`
- **_Framework Class (like bootstrap)_**. Example `page.locator('.btn.btn-primary')`

## Rule Details

This rule disallows the use of fragile or overly complex selectors in Playwright tests.
Poor selectors, such as chained CSS combinators, nth-child selectors, Bootstrap class names, or generated class names, make tests brittle and likely to break when the DOM structure or styling changes.

Instead, use Playwright’s recommended locator methods like `getByRole()`, `getByTestId()`, or `getByText()`, which create robust, maintainable tests that better reflect user intent.

The rule also checks page object variables that match a naming pattern (default: `"page"`) to ensure those selectors follow best practices.

## Configuration

### Options

| Option              | Type                     | Default | Description                                                                                                                                                                                                  |
| ------------------- | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pageObjectPattern` | `string (RegEx pattern)` | `page`  | The substring used to identify page objects (e.g., homePage, loginPage, settingsPage). When present, the rule also scans object literals whose variable names contain this pattern for poor selector values. |

### Example Configuration

```ts
rules: {
    'bstrict/no-poor-html-selector-playwright': ['warn', { pageObjectPattern: 'po' }]
}
```

## Examples

❌ Don't

```ts
// Overly complex CSS chain
page.locator(".sidebar > .menu > li > a");

// Deep XPath
page.locator('//div[@id="test"]/a/div');

// Position-based
page.locator("li:nth-child(3)");

// Framework-specific
page.locator(".btn.btn-primary");

// Generated or random class names
page.locator(".card-123abc");
```

✅ Do

```ts
page.locator(".sidebar > .menu");
page.locator('//div[@id="test"]/a');
page.getByRole("button", { name: "Submit" });
page.getByText("Continue");
page.getByTestId("login-button");
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/README.md#rules)
