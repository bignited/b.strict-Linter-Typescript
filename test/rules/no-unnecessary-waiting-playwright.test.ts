import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-unnecessary-waiting-playwright.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-unnecessary-waiting-playwright rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-unnecessary-waiting-playwright", rule, {
  valid: [
    {
      name: "Should pass: proper wait using page.waitForSelector()",
      code: "await page.waitForSelector('#done')",
    },
    {
      name: "Should pass: page.waitForTimeout() preceded by a full-line comment",
      code: "// this is a comment \n page.waitForTimeout(5000)",
    },
    {
      name: "Should pass: custom waitForTimeout() method from a non-page object",
      code: "someOtherObject.waitForTimeout(3000)",
    },
  ],

  invalid: [
    {
      name: "Should fail: page.waitForTimeout() with numeric argument",
      code: "page.waitForTimeout(5000)",
      errors: err("noUnnecessaryWaitingPlaywright"),
    },
    {
      name: "Should fail: page.waitForTimeout() preceded by inline comment (not full-line comment)",
      code: "page.goto(b.ignited) //this is a comment\n page.waitForTimeout(10)",
      errors: err("noUnnecessaryWaitingPlaywright"),
    },
    {
      name: "Should fail: page.waitForTimeout() with numeric variable argument",
      code: "const someNumber=500; page.waitForTimeout(someNumber)",
      errors: err("noUnnecessaryWaitingPlaywright"),
    },
    {
      name: "Should fail: page.waitForTimeout() called with function argument",
      code: "function test(delay) { page.waitForTimeout(delay); }",
      errors: err("noUnnecessaryWaitingPlaywright"),
    },
  ],
});
