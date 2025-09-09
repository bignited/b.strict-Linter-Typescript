import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../src/lib/rules/no-unnecessary-waiting";

/**
 * @fileoverview Tests for no-unnecessary-waiting.ts rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();
const errors: [{ messageId: "noUnnecessaryWaiting" }] = [
  { messageId: "noUnnecessaryWaiting" },
];

ruleTester.run("no-unnecessary-waiting", rule, {
  valid: [
    // test that only cy can call for wait
    {
      code: "foo.wait(10)",
    },

    // Test that wait works with an alias
    {
      code: 'cy.wait("@someRequest")',
    },

    // Test that wait works with an alias and options
    {
      code: 'cy.wait("@someRequest", { log: false })',
    },

    // Test that wait works with an alias and chaining
    {
      code: 'cy.wait("@someRequest").then((xhr) => xhr)',
    },

    // Test that wait works with an array of aliases
    {
      code: 'cy.wait(["@someRequest", "@anotherRequest"])',
    },

    // Test cy works with clock function
    {
      code: "cy.clock(5000)",
    },

    // Test cy work with scrollTo function
    {
      code: "cy.scrollTo(0, 10)",
    },

    // Test cy work with tick function
    {
      code: "cy.tick(500)",
    },

    // Test wait works with a variable that is an alias
    {
      code: 'const someRequest="@someRequest"; cy.wait(someRequest)',
    },

    //Test wait works when the line above is a full line comment
    {
      code: "//this is a comment\n cy.wait(10)",
    },
    // Test waitForTimeout is allowed when a full like comment is above
    {
      code: "// this is a comment \n page.waitForTimeout(5000)",
    },
  ],

  invalid: [
    // Test that wait has an error when arbitrary number is passed
    {
      code: "cy.wait(0)",
      errors,
    },

    // Test that wait has an error when arbitrary number is passed
    {
      code: "cy.wait(100)",
      errors,
    },

    // Test that wait has an error when arbitrary number is passed
    {
      code: "cy.wait(5000)",
      errors,
    },

    // Test that wait has an error when arbitrary number is through a variable
    {
      code: "const someNumber=500; cy.wait(someNumber)",
      errors,
    },

    // Test that wait has an error when arbitrary number is through a variable from a function
    {
      code: "function customWait (ms = 1) { cy.wait(ms) }",
      errors,
    },

    // Test that wait has an error when arbitrary number is through a variable from an arrowfunction
    {
      code: "const customWait = (ms = 1) => { cy.wait(ms) }",
      errors,
    },

    // Test that wait with arbitrary number has an error when chained from get
    {
      code: 'cy.get(".some-element").wait(10)',
      errors,
    },

    // Test that wait with arbitrary number has an error when chained
    {
      code: 'cy.get(".some-element").contains("foo").wait(10)',
      errors,
    },

    // Test that wait with arbitrary number has an error when chained from arrowfunction
    {
      code: 'const customWait = (ms = 1) => { cy.get(".some-element").wait(ms) }',
      errors,
    },

    //Test wait has an error when the line above is not a full line comment
    {
      code: "cy.visit(b.ignited) //this is a comment\n cy.wait(10)",
      errors,
    },

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
  ],
});
