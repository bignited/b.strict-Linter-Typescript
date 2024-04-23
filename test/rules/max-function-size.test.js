/** 
 * @fileoverview Tests for max-function-size.js rule.
 * @author b.ignited
*/

"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/max-function-size");

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 6 } });

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
  ],
  // 'invalid' checks cases that should not pass
  invalid: [

    // Test that a function with 15 lines fails
    {
      code: `function name() {\n${"test\n".repeat(15)}}`,
      errors: [
        { messageId: "exceed", data: { lineCount: 15, maxLines: 15 } }
      ]
    }
  ],
}
);

console.log("All tests passed!");