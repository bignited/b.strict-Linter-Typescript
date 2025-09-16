import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/lib/rules/one-assert-per-test-playwright";

/**
 * @fileoverview Tests for one-assert-per-test-playwright.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("one-assert-per-test-playwright", rule, {
  valid: [
    {
      code: `
      test('single expect', () => {
        expect(true).toBe(true);
      });
      `,
    },
    {
      code: `
      test('no assertions', () => {
        const x = 1 + 1;
      });
      `,
    },
    {
      code: `
      test('nested single expect', () => {
        if (true) {
          expect(false).toBe(false);
        }
      });
      `,
    },
  ],
  invalid: [
    {
      code: `
      test('two expects', () => {
        expect(true).toBe(true);
        expect(false).toBe(false);
      });
      `,
      errors: [{ messageId: "oneAssertPerTestPlaywright" }],
    },
    {
      code: `
      test('multiple nested expects', () => {
        if (true) {
          expect(true).toBe(true);
          expect(false).toBe(false);
        }
      });
      `,
      errors: [{ messageId: "oneAssertPerTestPlaywright" }],
    },
  ],
});
