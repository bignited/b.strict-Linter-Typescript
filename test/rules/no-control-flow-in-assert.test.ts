import rule from "../../dist/lib/rules/no-control-flow-in-assert.js";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-control-flow-in-assert rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-control-flow-in-assert", rule, {
  valid: [
    {
      name: "Should pass: simple expect without control flow",
      code: `expect(value).toBe(1);`,
    },
    {
      name: "Should pass: function passed to expect without control flow",
      code: `expect(() => { const x = 1; }).not.toThrow();`,
    },
    {
      name: "Should pass: cy.should() callback without control flow",
      code: `cy.get('button').should(($btn) => { expect($btn).to.exist; });`,
    },
    {
      name: "Should pass: control flow outside of expect or should callback",
      code: `
        if (value) {
          expect(value).toBe(1);
        }
      `,
    },
    {
      name: "Should pass: inline arrow callback without block body",
      code: `cy.get('button').should($btn => expect($btn).to.exist);`,
    },
    {
      name: "Should pass: control flow preceded by a comment inside expect callback",
      code: `
        expect(() => {
          // This is a comment
          if (value === 1) {
            throw new Error('fail');
          }
        }).toThrow();
      `,
    },
  ],

  invalid: [
    {
      name: "Should fail: if statement inside expect callback",
      code: `
        expect(() => {
          if (value === 1) {
            throw new Error('fail');
          }
        }).toThrow();
      `,
      errors: err("noControlFlowInAssert"),
    },
    {
      name: "Should fail: if/else chain inside expect callback",
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
    {
      name: "Should fail: switch statement inside expect callback",
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
    {
      name: "Should fail: if statement inside cy.should() callback",
      code: `
        cy.get('button').should(($btn) => {
          if ($btn.length) {
            expect($btn).to.have.text('Submit');
          }
        });
      `,
      errors: err("noControlFlowInAssert"),
    },
    {
      name: "Should fail: switch statement inside cy.should() callback",
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
    {
      name: "Should fail: nested if inside inner function within expect callback",
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
