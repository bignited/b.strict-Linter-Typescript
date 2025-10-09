import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-poor-html-selector-cypress.js";
import { err } from "../../dist/lib/utils/errors.js";

const ruleTester = new RuleTester();

ruleTester.run("no-poor-html-selector-cypress", rule, {
  valid: [
    // Test a simple CSS selector with one combinator
    {
      code: "cy.get('.sidebar > .menu')",
    },
    // Test a simple XPath selector with one slash level
    {
      code: "cy.xpath('//div[@id=\"test\"]/a')",
    },
    // Test a text-based selector (safe)
    {
      code: "cy.contains('Submit')",
    },
    // Test a data-testid attribute selector
    {
      code: "cy.get('[data-testid=\"login-button\"]')",
    },
  ],

  invalid: [
    // Test an overly complex CSS selector with multiple child combinators
    {
      code: "cy.get('.sidebar > .menu > li > a')",
      errors: err("noPoorHtmlSelectorCypress"),
    },

    // Test an overly complex XPath selector with too many slashes
    {
      code: "cy.xpath('//div[@id=\"test\"]/a/div')",
      errors: err("noPoorHtmlSelectorCypress"),
    },

    // Test a position-based CSS selector using nth-child()
    {
      code: "cy.get('li:nth-child(3)')",
      errors: err("noPoorHtmlSelectorCypress"),
    },

    // Test a framework-dependent selector (Bootstrap-style .btn classes)
    {
      code: "cy.get('.btn.btn-primary')",
      errors: err("noPoorHtmlSelectorCypress"),
    },

    // Test a potentially auto-generated selector with random alphanumeric
    {
      code: "cy.get('.card-123abc')",
      errors: err("noPoorHtmlSelectorCypress"),
    },

    // Test a selector containing multiple traversal combinators
    {
      code: "cy.get('.a > .b + .c ~ .d')",
      errors: err("noPoorHtmlSelectorCypress"),
    },
  ],
});
