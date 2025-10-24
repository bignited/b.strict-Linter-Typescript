import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-poor-html-selector-playwright.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-poor-html-selector-playwright rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-poor-html-selector-playwright", rule, {
  valid: [
    {
      name: "Should pass: simple CSS selector with one combinator",
      code: "page.locator('.sidebar > .menu')",
    },
    {
      name: "Should pass: simple XPath selector with one slash level",
      code: "page.locator('//div[@id=\"test\"]/a')",
    },
    {
      name: "Should pass: text-based locator using getByText()",
      code: "page.getByText('Submit')",
    },
    {
      name: "Should pass: role-based locator using getByRole() (Playwright best practice)",
      code: "page.getByRole('button', { name: 'Submit' })",
    },
    {
      name: "Should pass: test ID-based locator using getByTestId()",
      code: "page.getByTestId('login-button')",
    },
    {
      name: "Should pass: variable does not match default pattern 'page' and is therefore valid",
      code: "const home = { title: '.sidebar > .menu > li > a' }",
    },
  ],

  invalid: [
    {
      name: "Should fail: variable matches custom pattern 'po' and contains a poor selector",
      code: "const homePO = { title: '.sidebar > .menu > li > a' }",
      options: [{ pageObjectPattern: "po" }],
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: variable matches default pattern 'page' and contains a poor selector",
      code: "const homePage = { title: '.sidebar > .menu > li > a' }",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: overly complex CSS selector with multiple child combinators",
      code: "page.locator('.sidebar > .menu > li > a')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: overly complex XPath selector with too many nested slashes",
      code: "page.locator('//div[@id=\"test\"]/a/div')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: position-based CSS selector using nth-child()",
      code: "page.locator('li:nth-child(3)')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: framework-dependent selector using Bootstrap-style .btn classes",
      code: "page.locator('.btn.btn-primary')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: potentially auto-generated selector with random alphanumeric class",
      code: "page.locator('.card-123abc')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: selector containing multiple traversal combinators",
      code: "page.locator('.a > .b + .c ~ .d')",
      errors: err("noPoorHtmlSelector"),
    },
  ],
});
