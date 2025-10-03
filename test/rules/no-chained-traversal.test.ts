import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-chained-traversal.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-chained-traversal.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-chained-traversal", rule, {
  valid: [
    // Test using one .find() on Cypress chain gives no error
    {
      code: "cy.get('button').find('span')",
    },
    // Test Cypress get followed by an action, not traversal gives no error
    {
      code: "cy.get('div').click()",
    },
    // Test accessing parentNode only gives no error
    {
      code: "element.parentNode",
    },
    // Test accessing childNodes only gives no error
    {
      code: "el.childNodes",
    },
    // Test using querySelector once gives no error
    {
      code: "document.querySelector('.item')",
    },
    // Test single locator call gives no error
    {
      code: "page.locator('div')",
    },
  ],

  invalid: [
    // Chained .find() then .parent()
    {
      code: "cy.get('div').find('span').parent()",
      errors: err("noChainedTraversal"),
    },
    // Chained .children() then .siblings()
    {
      code: "cy.get('div').children().siblings()",
      errors: err("noChainedTraversal"),
    },
    // parentNode followed by childNodes
    {
      code: "element.parentNode.childNodes",
      errors: err("noChainedTraversal"),
    },
    // nextSibling followed by previousSibling
    {
      code: "el.nextSibling.previousSibling",
      errors: err("noChainedTraversal"),
    },
    // querySelector chained twice
    {
      code: "document.querySelector('ul').querySelector('li')",
      errors: err("noChainedTraversal"),
    },
    // Three chained locators
    {
      code: "page.locator('div').locator('span').locator('button')",
      errors: err("noChainedTraversal"),
    },
    // Chained locators for ul > li > a
    {
      code: "page.locator('ul').locator('li').locator('a')",
      errors: err("noChainedTraversal"),
    },
  ],
});
