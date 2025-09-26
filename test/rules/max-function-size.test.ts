import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/max-function-size.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for max-function-size.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("max-function-size", rule, {
  valid: [
    // Test single line standalone function
    {
      code: "function name() {}",
    },

    // Test that a function with 14 lines passes
    {
      code: `function name() {\n${"test\n".repeat(14)}}`,
    },

    // Test that a function with 15 lines of comments passes
    {
      code: `function name() {\n${"// test\n".repeat(15)}}`,
    },

    // Test that a function with more than 15 lines passes if it has a full line comment
    {
      code: `// this is a comment\n function name() {\n${"test\n".repeat(15)}}`,
    },
  ],
  invalid: [
    // Test that a function with 15 lines fails
    {
      code: `function name() {\n${"test\n".repeat(15)}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },

    // Test that a function with 15 lines of not full comment lines fails
    {
      code: `function name() {\n${"test // test\n".repeat(15)}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
  ],
});
