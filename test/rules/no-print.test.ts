import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-print.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-print rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-print", rule, {
  valid: [
    {
      name: "Should pass: console.debug() allowed",
      code: "console.debug()",
    },
    {
      name: "Should pass: custom object log method not using console",
      code: 'someOtherObject.log("This is not console");',
    },
    {
      name: "Should pass: accessing window.alert property without calling it",
      code: "window.alert",
    },
    {
      name: "Should pass: commented-out console.log() statement",
      code: '// console.log("This is a comment")',
    },
    {
      name: "Should pass: console.log() preceded by a full-line comment",
      code: "// This is a comment \n console.log()",
    },
    {
      name: "Should pass: alert() preceded by a full-line comment",
      code: "// This is a comment \n alert()",
    },
    {
      name: "Should pass: document.write() preceded by a full-line comment",
      code: "// This is a comment \n document.write()",
    },
  ],

  invalid: [
    {
      name: "Should fail: console.log() called directly",
      code: "console.log();",
      output: "",
      errors: err("noPrint", 1, { data: { name: "console.log" } }),
    },
    {
      name: "Should fail: console.info() called directly",
      code: "console.info();",
      output: "",
      errors: err("noPrint", 1, { data: { name: "console.info" } }),
    },
    {
      name: "Should fail: console.warn() called directly",
      code: "console.warn();",
      output: "",
      errors: err("noPrint", 1, { data: { name: "console.warn" } }),
    },
    {
      name: "Should fail: console.error() called directly",
      code: "console.error();",
      output: "",
      errors: err("noPrint", 1, { data: { name: "console.error" } }),
    },
    {
      name: "Should fail: alert() called directly",
      code: "alert();",
      output: "",
      errors: err("noPrint", 1, { data: { name: "alert" } }),
    },
    {
      name: "Should fail: document.write() called directly",
      code: "document.write();",
      output: "",
      errors: err("noPrint", 1, { data: { name: "document.write" } }),
    },
  ],
});
