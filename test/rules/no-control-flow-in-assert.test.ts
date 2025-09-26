import rule from "../../dist/lib/rules/no-control-flow-in-assert.js";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { err } from "../../dist/lib/utils/errors.js";

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
    // Test inline arrow callback without block
    {
      code: `cy.get('button').should($btn => expect($btn).to.exist);`,
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
      errors: err("noControlFlowInAssert"),
    },
    // Test if/else inside expect callback
    {
      code: `
        expect(() => {
          if (x === 1) {
            foo();
          } else if (x === 2) {
            bar();
          }
        }).toThrow();
      `,
      errors: err("noControlFlowInAssert", 2),
    },
    // Test switch inside expect callback
    {
      code: `
        expect(() => {
          switch (value) {
            case 1:
              foo();
              break;
            default:
              bar();
          }
        }).toThrow();
      `,
      errors: err("noControlFlowInAssert", 2),
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
      errors: err("noControlFlowInAssert"),
    },
    // Test Cypress: switch inside cy.should callback
    {
      code: `
        cy.get('button').should(($btn) => {
          switch ($btn.text()) {
            case 'OK':
              expect($btn).to.be.visible;
              break;
            case 'Cancel':
              expect($btn).to.not.exist;
              break;
          }
        });
      `,
      errors: err("noControlFlowInAssert", 2),
    },
    // Test nested if inside expect callback
    {
      code: `
        expect(() => {
          function inner() {
            if (true) {
              throw new Error('nested fail');
            }
          }
          inner();
        }).toThrow();
      `,
      errors: err("noControlFlowInAssert"),
    },
  ],
});
