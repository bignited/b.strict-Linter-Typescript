import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/lib/rules/no-print";

/**
 * @fileoverview Tests for no-print.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-print", rule, {
  valid: [
    // Test that a commented console.debug() gives no error
    {
      code: "console.debug()",
    },
    // Test that another object can call its own log method and it gives no error
    {
      code: 'someOtherObject.log("This is not console");',
    },
    // Test that accessing the alert method, but not calling it gives no error
    {
      code: "window.alert",
    },
    // Test that commented print statements give no error
    {
      code: '// console.log("This is a comment")',
    },
    // Test console log works when line above is a full line comment
    {
      code: "// This is a commenr \n console.log()",
    },
    // Test alert works when line above is a full line comment
    {
      code: "// This is a commenr \n alert()",
    },
    // Test document write works when line above is a full line comment
    {
      code: "// This is a commenr \n document.write()",
    },
  ],

  invalid: [
    // Test that console.log() gives error
    {
      code: "console.log()",
      output: "",
      errors: [{ messageId: "noPrint", data: { name: "console.log" } }],
    },
    // Test that console.info() gives error
    {
      code: "console.info()",
      output: "",
      errors: [{ messageId: "noPrint", data: { name: "console.info" } }],
    },
    // Test that console.warn() gives error
    {
      code: "console.warn()",
      output: "",
      errors: [{ messageId: "noPrint", data: { name: "console.warn" } }],
    },
    // Test that console.error() gives error
    {
      code: "console.error()",
      output: "",
      errors: [{ messageId: "noPrint", data: { name: "console.error" } }],
    },
    // Test that alert() gives error
    {
      code: "alert()",
      output: "",
      errors: [{ messageId: "noPrint", data: { name: "alert" } }],
    },
    // Test that document.write() gives error
    {
      code: "document.write()",
      output: "",
      errors: [{ messageId: "noPrint", data: { name: "document.write" } }],
    },
  ],
});
