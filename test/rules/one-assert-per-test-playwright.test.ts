import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/one-assert-per-test-playwright.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for one-assert-per-test-playwright.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("one-assert-per-test-playwright", rule, {
  valid: [
    // Test that a single expect is allowed
    {
      code: `
      test('single expect', () => {
        expect(true).toBe(true);
      });
      `,
    },
    // Test that a test without assertions is allowed
    {
      code: `
      test('no assertions', () => {
        const x = 1 + 1;
      });
      `,
    },
    // Test that a single nested expect is allowed
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
    // Test that multiple expects is not allowed
    {
      code: `
      test('two expects', () => {
        expect(true).toBe(true);
        expect(false).toBe(false);
      });
      `,
      errors: err("oneAssertPerTestPlaywright"),
    },
    // Test that multiple nestes expects is not allowed
    {
      code: `
      test('multiple nested expects', () => {
        if (true) {
          expect(true).toBe(true);
          expect(false).toBe(false);
        }
      });
      `,
      errors: err("oneAssertPerTestPlaywright"),
    },
  ],
});
