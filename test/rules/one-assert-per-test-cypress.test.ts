import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/one-assert-per-test-cypress.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for one-assert-per-test-cypress rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("one-assert-per-test-cypress", rule, {
  valid: [
    {
      name: "Should pass: test with a single expect() assertion",
      code: `
      it('single expect assertion', () => {
        expect(true).to.be.true;
      });
      `,
    },
    {
      name: "Should pass: test with a single cy.should() assertion",
      code: `
      it('single should assertion', () => {
        cy.get('button').should('be.visible');
      });
      `,
    },
    {
      name: "Should pass: test without any assertions",
      code: `
      it('no assertions', () => {
        const a = 1 + 2;
      });
      `,
    },
    {
      name: "Should pass: test with one nested expect() assertion",
      code: `
      it('nested single assertion', () => {
        if (true) {
          expect(true).to.be.true;
        }
      });
      `,
    },
    {
      name: "Should pass: test with multiple assertions preceded by a full-line comment",
      code: `
      // This is a comment
      it('two expects', () => {
        expect(true).to.be.true;
        expect(false).to.be.false;
      });
      `,
    },
  ],

  invalid: [
    {
      name: "Should fail: test containing two expect() assertions",
      code: `
      it('two expects', () => {
        expect(true).to.be.true;
        expect(false).to.be.false;
      });
      `,
      errors: err("oneAssertPerTestCypress"),
    },
    {
      name: "Should fail: test combining expect() and cy.should() assertions",
      code: `
      it('expect and should', () => {
        expect(true).to.be.true;
        cy.get('button').should('be.visible');
      });
      `,
      errors: err("oneAssertPerTestCypress"),
    },
    {
      name: "Should fail: test containing multiple nested assertions",
      code: `
      it('multiple nested assertions', () => {
        if (true) {
          expect(true).to.be.true;
          cy.get('button').should('be.visible');
        }
      });
      `,
      errors: err("oneAssertPerTestCypress"),
    },
  ],
});
