import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/one-assert-per-test-playwright.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for one-assert-per-test-playwright rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("one-assert-per-test-playwright", rule, {
  valid: [
    {
      name: "Should pass: test with a single expect() assertion",
      code: `
      test('single expect', () => {
        expect(true).toBe(true);
      });
      `,
    },
    {
      name: "Should pass: test without any assertions",
      code: `
      test('no assertions', () => {
        const x = 1 + 1;
      });
      `,
    },
    {
      name: "Should pass: test with one nested expect() assertion",
      code: `
      test('nested single expect', () => {
        if (true) {
          expect(false).toBe(false);
        }
      });
      `,
    },
    {
      name: "Should pass: test with multiple expects preceded by a full-line comment",
      code: `
      // This is a comment
      test('two expects', () => {
        expect(true).toBe(true);
        expect(false).toBe(false);
      });
      `,
    },
  ],

  invalid: [
    {
      name: "Should fail: test containing multiple expect() assertions",
      code: `
      test('two expects', () => {
        expect(true).toBe(true);
        expect(false).toBe(false);
      });
      `,
      errors: err("oneAssertPerTestPlaywright"),
    },
    {
      name: "Should fail: test containing multiple nested expect() assertions",
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
