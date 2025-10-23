import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-poor-html-selector-playwright.js";
import { err } from "../../dist/lib/utils/errors.js";

const ruleTester = new RuleTester();

ruleTester.run("no-poor-html-selector-playwright", rule, {
  valid: [
    // Simple CSS selector with one combinator
    {
      code: "page.locator('.sidebar > .menu')",
    },
    // Simple XPath selector with one slash level
    {
      code: "page.locator('//div[@id=\"test\"]/a')",
    },
    // Text-based locator (Playwright API)
    {
      code: "page.getByText('Submit')",
    },
    // Role-based locator (Playwright best practice)
    {
      code: "page.getByRole('button', { name: 'Submit' })",
    },
    // Test ID locator
    {
      code: "page.getByTestId('login-button')",
    },
  ],

  invalid: [
    // Overly complex CSS selector with multiple child combinators
    {
      code: "page.locator('.sidebar > .menu > li > a')",
      errors: err("noPoorHtmlSelector"),
    },

    // Overly complex XPath selector with too many slashes
    {
      code: "page.locator('//div[@id=\"test\"]/a/div')",
      errors: err("noPoorHtmlSelector"),
    },

    // Position-based CSS selector using nth-child()
    {
      code: "page.locator('li:nth-child(3)')",
      errors: err("noPoorHtmlSelector"),
    },

    // Framework-dependent selector (Bootstrap-style .btn classes)
    {
      code: "page.locator('.btn.btn-primary')",
      errors: err("noPoorHtmlSelector"),
    },

    // Auto-generated/randomized selector (e.g. build artifact class)
    {
      code: "page.locator('.card-123abc')",
      errors: err("noPoorHtmlSelector"),
    },

    // Selector with multiple traversal combinators
    {
      code: "page.locator('.a > .b + .c ~ .d')",
      errors: err("noPoorHtmlSelector"),
    },
  ],
});
