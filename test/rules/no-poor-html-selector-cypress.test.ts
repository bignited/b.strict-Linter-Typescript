import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-poor-html-selector-cypress.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-poor-html-selector-cypress rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-poor-html-selector-cypress", rule, {
  valid: [
    {
      name: "Should pass: simple CSS selector with one combinator",
      code: "cy.get('.sidebar > .menu')",
    },
    {
      name: "Should pass: simple XPath selector with one slash level",
      code: "cy.xpath('//div[@id=\"test\"]/a')",
    },
    {
      name: "Should pass: text-based selector (safe)",
      code: "cy.contains('Submit')",
    },
    {
      name: "Should pass: data-testid attribute selector",
      code: "cy.get('[data-testid=\"login-button\"]')",
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
      code: "cy.get('.sidebar > .menu > li > a')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: overly complex XPath selector with too many slashes",
      code: "cy.xpath('//div[@id=\"test\"]/a/div')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: position-based CSS selector using nth-child()",
      code: "cy.get('li:nth-child(3)')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: framework-dependent selector (Bootstrap-style .btn classes)",
      code: "cy.get('.btn.btn-primary')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: potentially auto-generated selector with random alphanumeric class",
      code: "cy.get('.card-123abc')",
      errors: err("noPoorHtmlSelector"),
    },
    {
      name: "Should fail: selector containing multiple traversal combinators",
      code: "cy.get('.a > .b + .c ~ .d')",
      errors: err("noPoorHtmlSelector"),
    },
  ],
});
