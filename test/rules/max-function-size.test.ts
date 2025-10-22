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
    // Test that a callback function with more than 15 lines inside an ignored keyword call is ignored
    {
      code: `test.describe('testing', () => {\n${"test\n".repeat(15)}})`,
    },
    // Test that a callback function with more than 15 lines inside an ignored keyword call is ignored
    {
      code: `describe('testing', () => {\n${"test\n".repeat(15)}})`,
    },
    // Test that a named function declaration with a test keyword name is ignored
    {
      code: `function describe() {\n${"test\n".repeat(15)}}`,
    },
    // Test that an arrow function assigned to a variable with a test keyword name is ignored
    {
      code: `const describe = () => {\n${"test\n".repeat(15)}}`,
    },
  ],
  invalid: [
    // Test that a callback function with more than 15 lines inside a not ignored keyword call gives an error
    {
      code: `test.myfunction('testing', () => {\n${"test\n".repeat(15)}})`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },

    // Test that a callback function with more than 15 lines inside a not ignored keyword call gives an error
    {
      code: `myfunction('testing', () => {\n${"test\n".repeat(15)}})`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },

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

    // Test that an arrow function with 15 lines of not full comment lines fails
    {
      code: `const name = () => {\n${"test\n".repeat(15)}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
  ],
});
