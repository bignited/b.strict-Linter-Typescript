import rule from "../../dist/lib/rules/no-control-flow-in-assert.js";
import { RuleTester } from "@typescript-eslint/rule-tester";

/**
 * @fileoverview Tests for no-control-flow-in-assert.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-control-flow-in-assert", rule, {
  valid: [
    // Test simple expect without control flow
    {
      code: `expect(value).toBe(1);`,
    },
    // Test function passed to expect without control flow
    {
      code: `expect(() => { const x = 1; }).not.toThrow();`,
    },
    // Test cy.should with no control flow
    {
      code: `cy.get('button').should(($btn) => { expect($btn).to.exist; });`,
    },
    // Test control flow outside of expect/should
    {
      code: `
        if (value) {
          expect(value).toBe(1);
        }
      `,
    },
  ],
  invalid: [
    // Test if inside expect callback
    {
      code: `
        expect(() => {
          if (value === 1) {
            throw new Error('fail');
          }
        }).toThrow();
      `,
      errors: [{ messageId: "noControlFlowInAssert" }],
    },
    // Test return inside expect callback
    {
      code: `
        expect(() => {
          if (!value) return;
          doSomething();
        }).not.toThrow();
      `,
      errors: [{ messageId: "noControlFlowInAssert" }],
    },
    // Test Cypress: if inside cy.should callback
    {
      code: `
        cy.get('button').should(($btn) => {
          if ($btn.length) {
            expect($btn).to.have.text('Submit');
          }
        });
      `,
      errors: [{ messageId: "noControlFlowInAssert" }],
    },
  ],
});
