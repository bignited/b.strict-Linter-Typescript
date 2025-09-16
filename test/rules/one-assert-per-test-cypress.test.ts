import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/lib/rules/one-assert-per-test-cypress";

/**
 * @fileoverview Tests for one-assert-per-test-cypress.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("one-assert-per-test-cypress", rule, {
  valid: [
    {
      code: `
      it('single expect assertion', () => {
        expect(true).to.be.true;
      });
      `,
    },
    {
      code: `
      it('single should assertion', () => {
        cy.get('button').should('be.visible');
      });
      `,
    },
    {
      code: `
      it('no assertions', () => {
        const a = 1 + 2;
      });
      `,
    },
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
    {
      code: `
      it('two expects', () => {
        expect(true).to.be.true;
        expect(false).to.be.false;
      });
      `,
      errors: [{ messageId: "oneAssertPerTestCypress" }],
    },
    {
      code: `
      it('expect and should', () => {
        expect(true).to.be.true;
        cy.get('button').should('be.visible');
      });
      `,
      errors: [{ messageId: "oneAssertPerTestCypress" }],
    },
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
