import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../../dist/lib/rules/no-force.js";
import { err } from "../../dist/lib/utils/errors.js";

/**
 * @fileoverview Tests for no-force rule.
 * @author b.ignited
 */

const ruleTester = new RuleTester();

ruleTester.run("no-force", rule, {
  valid: [
    {
      name: "Should pass: standard click() call without options",
      code: "cy.get('button').click()",
    },
    {
      name: "Should pass: click() with accepted options (no force)",
      code: "cy.get('button').click({multiple: true})",
    },
    {
      name: "Should pass: standard dblclick() call",
      code: "cy.get('button').dblclick()",
    },
    {
      name: "Should pass: type() without options",
      code: "cy.get('input').type('somth')",
    },
    {
      name: "Should pass: type() with accepted options (no force)",
      code: "cy.get('input').type('somth', {anyoption: true})",
    },
    {
      name: "Should pass: trigger() with accepted options (no force)",
      code: "cy.get('input').trigger('click', {anyoption: true})",
    },
    {
      name: "Should pass: rightclick() with accepted options (no force)",
      code: "cy.get('input').rightclick({anyoption: true})",
    },
    {
      name: "Should pass: check() without options",
      code: "cy.get('input').check()",
    },
    {
      name: "Should pass: uncheck() without options",
      code: "cy.get('input').uncheck()",
    },
    {
      name: "Should pass: select() without options",
      code: "cy.get('input').select()",
    },
    {
      name: "Should pass: focus() without options",
      code: "cy.get('input').focus()",
    },
    {
      name: "Should pass: document trigger() with accepted options (no force)",
      code: 'cy.document().trigger("keydown", { ...event })',
    },
    {
      name: "Should pass: click() with {force: true} preceded by a comment line",
      code: "// this is a comment\n cy.get('button').click({force: true})",
    },
    {
      name: "Should pass: click() with {force: false} option",
      code: "cy.get('input').click({ force: false })",
    },
    {
      name: "Should pass: custom locator command using {force: true}",
      code: "locator.customClick({ force: true })",
    },
  ],

  invalid: [
    {
      name: "Should fail: click() called with {force: true}",
      code: "cy.get('button').click({force: true})",
      output: "cy.get('button').click()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: dblclick() called with {force: true}",
      code: "cy.get('button').dblclick({force: true})",
      output: "cy.get('button').dblclick()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: type() called with {force: true}",
      code: "cy.get('input').type('somth', {force: true})",
      output: "cy.get('input').type('somth')",
      errors: err("noForce"),
    },
    {
      name: "Should fail: type() with {force: true} in chained command",
      code: "cy.get('div').find('.foo').type('somth', {force: true})",
      output: "cy.get('div').find('.foo').type('somth')",
      errors: err("noForce"),
    },
    {
      name: "Should fail: click() with {force: true} in deep chain",
      code: "cy.get('div').find('.foo').find('.bar').click({force: true})",
      output: "cy.get('div').find('.foo').find('.bar').click()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: trigger() with {force: true} in deep chain",
      code: "cy.get('div').find('.foo').find('.bar').trigger('change', {force: true})",
      output: "cy.get('div').find('.foo').find('.bar').trigger('change')",
      errors: err("noForce"),
    },
    {
      name: "Should fail: trigger() called with {force: true}",
      code: "cy.get('input').trigger('click', {force: true})",
      output: "cy.get('input').trigger('click')",
      errors: err("noForce"),
    },
    {
      name: "Should fail: rightclick() called with {force: true}",
      code: "cy.get('input').rightclick({force: true})",
      output: "cy.get('input').rightclick()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: check() called with {force: true}",
      code: "cy.get('input').check({force: true})",
      output: "cy.get('input').check()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: uncheck() called with {force: true}",
      code: "cy.get('input').uncheck({force: true})",
      output: "cy.get('input').uncheck()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: select() called with {force: true}",
      code: "cy.get('input').select({force: true})",
      output: "cy.get('input').select()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: focus() called with {force: true}",
      code: "cy.get('input').focus({force: true})",
      output: "cy.get('input').focus()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: click() with {force: true} preceded by inline comment, not full-line comment",
      code: "cy.visit('b.ignited') // this is a comment\n cy.get('button').click({force: true})",
      output:
        "cy.visit('b.ignited') // this is a comment\n cy.get('button').click()",
      errors: err("noForce"),
    },
    {
      name: "Should fail: forced uncheck() custom command",
      code: "locator.uncheck({ force: true })",
      output: "locator.uncheck()",
      errors: err("noForce"),
    },
  ],
});
