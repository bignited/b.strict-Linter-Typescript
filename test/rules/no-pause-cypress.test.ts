import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-pause-cypress.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-pause-cypress rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-pause-cypress", rule, {
  valid: [
    {
      name: "Should pass: standalone pause() function call (not cy.pause)",
      code: "pause()",
    },
    {
      name: "Should pass: pause() called from non-cy object",
      code: "foo.pause()",
    },
    {
      name: "Should pass: standard Cypress action without pause (dblclick)",
      code: "cy.get('button').dblclick()",
    },
    {
      name: "Should pass: cy.pause() call preceded by a comment line",
      code: "// this is a comment\n cy.get('button').pause()",
    },
  ],

  invalid: [
    {
      name: "Should fail: cy.pause() called directly",
      code: "cy.pause()",
      errors: err("noPauseCypress"),
    },
    {
      name: "Should fail: cy.pause() called with options",
      code: "cy.pause({ log: false })",
      errors: err("noPauseCypress"),
    },
    {
      name: "Should fail: cy.get() chain ending with pause()",
      code: "cy.get('button').pause()",
      errors: err("noPauseCypress"),
    },
    {
      name: "Should fail: cy.pause() called before another command in chain",
      code: "cy.pause().getCookie('app')",
      errors: err("noPauseCypress"),
    },
    {
      name: "Should fail: cy.get() chain with multiple assertions followed by pause()",
      code: "cy.get('button').should('have.attr', 'value').and('match', submit).pause()",
      errors: err("noPauseCypress"),
    },
  ],
});
