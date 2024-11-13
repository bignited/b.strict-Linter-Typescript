/* eslint-disable complexity */
/* eslint-disable bstrict/max-function-size */
/**
 * @fileoverview A rule to enforce no waiting time in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

'use strict';

const { getFullCommentLineNumbers } = require('../comment-support/line-numbers');

/**
 * Identifies if a node is a MemberExpression, Is called by cy, Is an Identifier and property is wait.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function isCallingCyWait(node) {
  if (node.callee.type === 'MemberExpression' && nodeIsCalledByCy(node) && node.callee.property.type === 'Identifier' && node.callee.property.name === 'wait') {
    return true;
  }
}

/**
 * Identifies if a node is called by cy.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function nodeIsCalledByCy(node) {
  if (node.type === 'Identifier' && node.name === 'cy') {
    return true;
  }

  if (typeof node.callee === 'undefined' || typeof node.callee.object === 'undefined') {
    return false;
  }
  return nodeIsCalledByCy(node.callee.object);
}

/**
 * Identifies if a node is a number argument.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function isNumberArgument(node) {
  if (node.arguments.length > 0 && node.arguments[0].type === 'Literal' && typeof (node.arguments[0].value) === 'number') {
    return true;
  }
}

/**
 * Identifies if a node is an identifier number const argument.
 * @param {ASTNode} node Node to test.
 * @param {Scope} scope Scope of the node.
 * @returns {boolean} True if it's condition is met.
 */
function isIdentifierNumberConstArgument(node, scope) {
  if (node.arguments.length === 0) {
    return false;
  }

  if (node.arguments[0].type !== 'Identifier') {
    return false;
  }

  const identifier = node.arguments[0];
  const resolvedIdentifier = scope.references.find((ref) => {return ref.identifier === identifier}).resolved;
  const definition = resolvedIdentifier.defs[0];
  const isVariable = definition.type === 'Variable';

  // don't refactor in seperate function, this will break the tests
  if (isVariable) {
    if (!definition.node.init) {
      return false;
    }
    return typeof definition.node.init.value === 'number';
  }

  // don't refactor in seperate function, this will break the tests
  if (definition.type === 'ImportBinding') {
    return false;
  }

  const param = definition.node.params[definition.index];

  // don't refactor in seperate function, this will break the tests
  if (!param || param.type !== 'AssignmentPattern') {
    return false;
  }
  return typeof param.right.value === 'number';
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow unnecessary waiting',
      url: 'https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/no-unnecessary-waiting.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected: 'Do not wait for arbitrary time periods',
    },
    recommended: true
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const comments = getFullCommentLineNumbers(sourceCode.getAllComments(), sourceCode);

    /**
     * Check if the node is calling cy.wait
     * @param {ASTNode} node Node to test.
     * @private
     */
    function checkNodeIsCallingCyWait(node) {
      if (isCallingCyWait(node)) {
        const scope = sourceCode.getScope ? sourceCode.getScope(node) : context.getScope();

        if (isIdentifierNumberConstArgument(node, scope) || isNumberArgument(node) && !comments.has(node.loc.start.line - 1)) {
          context.report({ node, messageId: 'unexpected' });
        }
      }
    }

    return {
      CallExpression: checkNodeIsCallingCyWait,
    };
  },
};