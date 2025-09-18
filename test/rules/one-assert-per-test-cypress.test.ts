import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/one-assert-per-test-cypress.js";

/**
 * @fileoverview Tests for one-assert-per-test-cypress.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("one-assert-per-test-cypress", rule, {
  valid: [
    // Test that a single expect assertion is allowed
    {
      code: `
      it('single expect assertion', () => {
        expect(true).to.be.true;
      });
      `,
    },
    // Test that a single should assertion is allowed
    {
      code: `
      it('single should assertion', () => {
        cy.get('button').should('be.visible');
      });
      `,
    },
    // Test that a test without assertions is allowed
    {
      code: `
      it('no assertions', () => {
        const a = 1 + 2;
      });
      `,
    },
    // Tes that a nested assert is allowed
    {
      code: `
      it('nested single assertion', () => {
        if (true) {
          expect(true).to.be.true;
        }
      });
      `,
    },
  ],
  invalid: [
    // Test that two expect assertions is not allowed
    {
      code: `
      it('two expects', () => {
        expect(true).to.be.true;
        expect(false).to.be.false;
      });
      `,
      errors: [{ messageId: "oneAssertPerTestCypress" }],
    },
    // Test that a combination of expect and assert is not allowed
    {
      code: `
      it('expect and should', () => {
        expect(true).to.be.true;
        cy.get('button').should('be.visible');
      });
      `,
      errors: [{ messageId: "oneAssertPerTestCypress" }],
    },
    // Test that multiple nested assertions is not allowed
    {
      code: `
      it('multiple nested assertions', () => {
        if (true) {
          expect(true).to.be.true;
          cy.get('button').should('be.visible');
        }
      });
      `,
      errors: [{ messageId: "oneAssertPerTestCypress" }],
    },
  ],
});
