# bstrict/no-poor-html-selector-cypress

**Description:** Disallow using poor HTML selectors in Cypress.
A poor selector is considered one of:

- **_Has Multiple Traversal Combinators_**. Example: `cy.get('div > li > a')`
- **_Is Deep Xpath_**. Example: `cy.get('//div/ul/li/a')`
- **_Uses Nth Child_**. Example: `cy.get('ul li:nth-child(3)')`
- **_Randomized Class_**. Example: `cy.get('.card-123abc')`
- **_Framework Class (like bootstrap)_**. Example `cy.get('.btn.btn-primary')`

## Rule Details

This rule disallows the use of poor or unstable HTML selectors in Cypress tests.
Complex or fragile selectors, such as deep CSS chains, position-based queries, or style-dependent classes, make tests brittle and prone to breaking when the UI structure changes.

Instead, tests should use stable, semantic selectors like `data-testid` or `data-cy`, which are designed specifically for testing.

The rule also checks selectors used in page objects, matching variable names with the configured pattern (by default, any variable ending in `Page`).

## Configuration

### Options

| Option              | Type                     | Default | Description                                                                                                                                                                                                  |
| ------------------- | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pageObjectPattern` | `string (RegEx pattern)` | `page`  | The substring used to identify page objects (e.g., homePage, loginPage, settingsPage). When present, the rule also scans object literals whose variable names contain this pattern for poor selector values. |

### Example Configuration

```ts
rules: {
    'bstrict/no-poor-html-selector-cypress': ['warn', { pageObjectPattern: 'po' }]
}
```

## Examples

❌ Don't

```ts
//Complex CSS chain
cy.get(".sidebar > .menu > li > a");

// Deep XPath
cy.xpath('//div[@id="test"]/a/div');

// Position-based
cy.get("li:nth-child(3)");

// Framework-dependent
cy.get(".btn.btn-primary");

// Randomized or generated
cy.get(".card-123abc");
```

✅ Do

```ts
cy.get(".sidebar > .menu");
cy.xpath('//div[@id="test"]/a');
cy.contains("Submit");
cy.get('[data-testid="login-button"]');
```

## Fixable by code

❌ - This rule does not have a `--fix` functionality.

[⬅ Back to Rules](https://github.com/bignited/b.strict-Linter-Javascript/blob/develop/README.md#rules)
