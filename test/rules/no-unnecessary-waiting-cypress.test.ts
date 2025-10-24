import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-unnecessary-waiting-cypress.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-unnecessary-waiting-cypress rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-unnecessary-waiting-cypress", rule, {
  valid: [
    {
      name: "Should pass: wait() called from non-cy object",
      code: "foo.wait(10)",
    },
    {
      name: "Should pass: cy.wait() with alias argument",
      code: 'cy.wait("@someRequest")',
    },
    {
      name: "Should pass: cy.wait() with alias and options",
      code: 'cy.wait("@someRequest", { log: false })',
    },
    {
      name: "Should pass: cy.wait() with alias and chained .then()",
      code: 'cy.wait("@someRequest").then((xhr) => xhr)',
    },
    {
      name: "Should pass: cy.wait() with an array of aliases",
      code: 'cy.wait(["@someRequest", "@anotherRequest"])',
    },
    {
      name: "Should pass: cy.clock() with argument",
      code: "cy.clock(5000)",
    },
    {
      name: "Should pass: cy.scrollTo() with arguments",
      code: "cy.scrollTo(0, 10)",
    },
    {
      name: "Should pass: cy.tick() with argument",
      code: "cy.tick(500)",
    },
    {
      name: "Should pass: cy.wait() with variable alias",
      code: 'const someRequest="@someRequest"; cy.wait(someRequest)',
    },
    {
      name: "Should pass: cy.wait() with numeric argument preceded by a full-line comment",
      code: "//this is a comment\n cy.wait(10)",
    },
  ],

  invalid: [
    {
      name: "Should fail: cy.wait() with 0 milliseconds",
      code: "cy.wait(0)",
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with 100 milliseconds",
      code: "cy.wait(100)",
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with 5000 milliseconds",
      code: "cy.wait(5000)",
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with numeric variable argument",
      code: "const someNumber=500; cy.wait(someNumber)",
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with variable argument from function parameter",
      code: "function customWait (ms = 1) { cy.wait(ms) }",
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with variable argument from arrow function parameter",
      code: "const customWait = (ms = 1) => { cy.wait(ms) }",
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with numeric argument chained from cy.get()",
      code: 'cy.get(".some-element").wait(10)',
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with numeric argument chained after contains()",
      code: 'cy.get(".some-element").contains("foo").wait(10)',
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with variable argument in chained arrow function",
      code: 'const customWait = (ms = 1) => { cy.get(".some-element").wait(ms) }',
      errors: err("noUnnecessaryWaitingCypress"),
    },
    {
      name: "Should fail: cy.wait() with numeric argument preceded by inline comment (not full-line comment)",
      code: "cy.visit(b.ignited) //this is a comment\n cy.wait(10)",
      errors: err("noUnnecessaryWaitingCypress"),
    },
  ],
});
