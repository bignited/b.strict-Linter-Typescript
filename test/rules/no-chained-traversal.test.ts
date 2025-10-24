import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-chained-traversal.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-chained-traversal rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-chained-traversal", rule, {
  valid: [
    {
      name: "Should pass: single .find() call on Cypress chain",
      code: "cy.get('button').find('span')",
    },
    {
      name: "Should pass: Cypress get() followed by action (not traversal)",
      code: "cy.get('div').click()",
    },
    {
      name: "Should pass: accessing parentNode once",
      code: "element.parentNode",
    },
    {
      name: "Should pass: accessing childNodes once",
      code: "el.childNodes",
    },
    {
      name: "Should pass: single querySelector() call",
      code: "document.querySelector('.item')",
    },
    {
      name: "Should pass: single locator() call in Playwright",
      code: "page.locator('div')",
    },
  ],

  invalid: [
    {
      name: "Should fail: chained .find() followed by .parent()",
      code: "cy.get('div').find('span').parent()",
      errors: err("noChainedTraversal"),
    },
    {
      name: "Should fail: chained .children() followed by .siblings()",
      code: "cy.get('div').children().siblings()",
      errors: err("noChainedTraversal"),
    },
    {
      name: "Should fail: chained DOM properties parentNode → childNodes",
      code: "element.parentNode.childNodes",
      errors: err("noChainedTraversal"),
    },
    {
      name: "Should fail: chained DOM properties nextSibling → previousSibling",
      code: "el.nextSibling.previousSibling",
      errors: err("noChainedTraversal"),
    },
    {
      name: "Should fail: querySelector() chained twice",
      code: "document.querySelector('ul').querySelector('li')",
      errors: err("noChainedTraversal"),
    },
    {
      name: "Should fail: three chained Playwright locator() calls",
      code: "page.locator('div').locator('span').locator('button')",
      errors: err("noChainedTraversal"),
    },
    {
      name: "Should fail: chained Playwright locator() for ul > li > a",
      code: "page.locator('ul').locator('li').locator('a')",
      errors: err("noChainedTraversal"),
    },
  ],
});
