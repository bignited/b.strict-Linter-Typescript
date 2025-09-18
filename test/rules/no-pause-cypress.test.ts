import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-pause-cypress.js";

/**
 * @fileoverview Tests for no-pause.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();
const errors: [{ messageId: "noPauseCypress" }] = [
  { messageId: "noPauseCypress" },
];

ruleTester.run("no-pause-cypress", rule, {
  valid: [
    // Test that regular pause function is called
    {
      code: "pause()",
    },

    // test that only cy can call for pause
    {
      code: "foo.pause()",
    },

    // Test that does button double click function
    {
      code: "cy.get('button').dblclick()",
    },

    // Test that comment before pause function is called
    {
      code: "// this is a comment\n cy.get('button').pause()",
    },
  ],

  invalid: [
    // Test that cy.pause() function is called
    {
      code: "cy.pause()",
      errors,
    },

    // Test that cy.pause() function is called with options
    {
      code: "cy.pause({ log: false })",
      errors,
    },

    // Test that pause() function is called after another call function
    {
      code: "cy.get('button').pause()",
      errors,
    },

    // Test that pause() function is called before another function
    {
      code: "cy.pause().getCookie('app')",
      errors,
    },

    // Test that pause() function is called complex call function
    {
      code: "cy.get('button').should('have.attr', 'value').and('match', submit).pause()",
      errors,
    },
  ],
});
