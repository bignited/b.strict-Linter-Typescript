import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-unnecessary-waiting-playwright.js";

/**
 * @fileoverview Tests for no-unnecessary-waiting-playwright.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();
const errors: [{ messageId: "noUnnecessaryWaitingPlaywright" }] = [
  { messageId: "noUnnecessaryWaitingPlaywright" },
];

ruleTester.run("no-unnecessary-waiting-playwright", rule, {
  valid: [
    // Test that other good practice waits dont give error
    {
      code: "await page.waitForSelector('#done')",
    },
    // Test waitForTimeout is allowed when a full like comment is above
    {
      code: "// this is a comment \n page.waitForTimeout(5000)",
    },
    // Test that another object can call a custom waitForTimeout method
    {
      code: "someOtherObject.waitForTimeout(3000)",
    },
  ],

  invalid: [
    // Test waitForTimeout gives an error
    {
      code: "page.waitForTimeout(5000)",
      errors,
    },

    // Test wait gives an error when the line above is not a full line comment
    {
      code: "page.goto(b.ignited) //this is a comment\n page.waitForTimeout(10)",
      errors,
    },

    // Test that waitForTimeout gives an error when arbitrary number is through a variable
    {
      code: "const someNumber=500; page.waitForTimeout(someNumber)",
      errors,
    },
    // Test that waitForTimeour gives an error when a function argument is passed to it
    {
      code: "function test(delay) { page.waitForTimeout(delay); }",
      errors,
    },
  ],
});
