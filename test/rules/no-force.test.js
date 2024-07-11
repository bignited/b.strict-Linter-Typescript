/** 
 * @fileoverview Tests for no-force.js rule.
 * @author b.ignited
*/

'use strict';

const { RuleTester } = require('eslint');
const rule = require('../../lib/rules/no-force');

const ruleTester = new RuleTester();
const errors = [{ messageId: 'unexpected' }];

ruleTester.run('no-force', rule, {
  valid: [

    // Test that does default button click function
    {
      code: 'cy.get(\'button\').click()'
    },

    // Test that does default button click function with accepted options
    {
      code: 'cy.get(\'button\').click({multiple: true})'
    },

    // Test that does default button double click function
    {
      code: 'cy.get(\'button\').dblclick()'
    },

    // Test that does default type function
    {
      code: 'cy.get(\'input\').type(\'somth\')'
    },

    // Test that does default type function with accepted options
    {
      code: 'cy.get(\'input\').type(\'somth\', {anyoption: true})'
    },

    // Test that does default trigger function with accepted options
    {
      code: 'cy.get(\'input\').trigger(\'click\', {anyoption: true})'
    },

    // Test that does default rightclick function with accepted options
    {
      code: 'cy.get(\'input\').rightclick({anyoption: true})'
    },

    // Test that does default check function
    {
      code: 'cy.get(\'input\').check()'
    },

    // Test that does default uncheck function
    {
      code: 'cy.get(\'input\').uncheck()'
    },

    // Test that does default select function
    {
      code: 'cy.get(\'input\').select()'
    },

    // Test that does default focus function
    {
      code: 'cy.get(\'input\').focus()'
    },

    // Test that does default document trigger function with accepted options
    {
      code: 'cy.document().trigger("keydown", { ...event })'
    },

    // Test that does click function with force option but has comment above it
    {
      code: '// this is a comment\n cy.get(\'button\').click({force: true})'
    },
  ],

  invalid: [

    // Test that does click function with force option
    {
      code: 'cy.get(\'button\').click({force: true})', errors
    },

    // Test that does double click function with force option
    {
      code: 'cy.get(\'button\').dblclick({force: true})', errors
    },

    // Test that does type function with force option
    {
      code: 'cy.get(\'input\').type(\'somth\', {force: true})', errors
    },

    // Test that does type function with force option in chainable function
    {
      code: 'cy.get(\'div\').find(\'.foo\').type(\'somth\', {force: true})', errors
    },

    // Test that does click function with force option in chainable function
    {
      code: 'cy.get(\'div\').find(\'.foo\').find(\'.bar\').click({force: true})', errors
    },

    // Test that does trigger function with force option in chainable function
    {
      code: 'cy.get(\'div\').find(\'.foo\').find(\'.bar\').trigger(\'change\', {force: true})', errors
    },

    // Test that does trigger function with force option
    {
      code: 'cy.get(\'input\').trigger(\'click\', {force: true})', errors
    },

    // Test that does rightclick function with force option
    {
      code: 'cy.get(\'input\').rightclick({force: true})', errors
    },

    // Test that does check function with force option
    {
      code: 'cy.get(\'input\').check({force: true})', errors
    },

    // Test that does uncheck function with force option
    {
      code: 'cy.get(\'input\').uncheck({force: true})', errors
    },

    //Test that does select function with force option
    {
      code: 'cy.get(\'input\').select({force: true})', errors
    },

    // Test that does focus function with force option
    {
      code: 'cy.get(\'input\').focus({force: true})', errors
    },

    // Test that does default button click function with force option and no full line comment above it
    {
      code: 'cy.visit(\'b.ignited\') // this is a comment\n cy.get(\'button\').click({force: true})', errors
    },
  ],
});