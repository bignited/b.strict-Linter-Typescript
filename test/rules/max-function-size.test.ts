import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/max-function-size.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for max-function-size rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("max-function-size", rule, {
  valid: [
    {
      name: "Should pass: single-line standalone function",
      code: "function name() {}",
    },
    {
      name: "Should pass: function with 14 lines",
      code: `function name() {\n${"test\n".repeat(14)}}`,
    },
    {
      name: "Should pass: function with 15 lines of comments only",
      code: `function name() {\n${"// test\n".repeat(15)}}`,
    },
    {
      name: "Should pass: function with more than 15 lines preceded by a full-line comment",
      code: `// this is a comment\n function name() {\n${"test\n".repeat(16)}}`,
    },
    {
      name: "Should pass: callback with more than 15 lines inside ignored keyword call 'test.describe'",
      code: `test.describe('testing', () => {\n${"test\n".repeat(16)}})`,
    },
    {
      name: "Should pass: callback with more than 15 lines inside ignored keyword call 'describe'",
      code: `describe('testing', () => {\n${"test\n".repeat(16)}})`,
    },
    {
      name: "Should pass: named function larger than 15 lines ignored via declarationIgnores option",
      code: `function describe() {\n${"test\n".repeat(16)}}`,
      options: [{ declarationIgnores: ["describe"] }],
    },
    {
      name: "Should pass: arrow function assigned to variable ignored via declarationIgnores option",
      code: `const describe = () => {\n${"test\n".repeat(16)}}`,
      options: [{ declarationIgnores: ["describe"] }],
    },
    {
      name: "Should pass: async arrow method inside class ignored via methodIgnores option",
      code: `class MyClass { \nasync describe() {${"test\n".repeat(16)}}}`,
      options: [{ methodIgnores: ["describe"] }],
    },
    {
      name: "Should pass: function below user-defined max lines",
      code: `function short() {\n${"test\n".repeat(9)}}`,
      options: [{ maxLines: 10 }],
    },
    {
      name: "Should pass: multiple ignore types combined (declaration and method)",
      code: `
        function describe() {${"test\n".repeat(16)}}
        class MyClass { describe() {${"test\n".repeat(16)}}}
      `,
      options: [
        {
          declarationIgnores: ["describe"],
          methodIgnores: ["describe"],
        },
      ],
    },
  ],

  invalid: [
    {
      name: "Should fail: class method exceeding 15 lines without ignore keyword",
      code: `class MyClass { myfunction() {\n${"test\n".repeat(15)}}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
    {
      name: "Should fail: callback with more than 15 lines in non-ignored keyword call 'test.myfunction'",
      code: `test.myfunction('testing', () => {\n${"test\n".repeat(15)}})`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
    {
      name: "Should fail: callback with more than 15 lines in plain call 'myfunction'",
      code: `myfunction('testing', () => {\n${"test\n".repeat(16)}})`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 16, maxLines: 15 },
      }),
    },
    {
      name: "Should fail: function declaration with 15 lines",
      code: `function name() {\n${"test\n".repeat(15)}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
    {
      name: "Should fail: function with 15 lines containing partial comment lines",
      code: `function name() {\n${"test // test\n".repeat(15)}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
    {
      name: "Should fail: arrow function with 15 lines of non-comment content",
      code: `const name = () => {\n${"test\n".repeat(15)}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 15, maxLines: 15 },
      }),
    },
    {
      name: "Should fail: async arrow function inside class exceeding 15 lines without ignore keyword",
      code: `class MyClass { describe = async () => {\n${"test\n".repeat(
        16
      )}}}`,
      errors: err("maxFunctionSize", 1, {
        data: { lineCount: 16, maxLines: 15 },
      }),
    },
  ],
});
