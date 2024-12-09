/* eslint-disable complexity */
/**
 * @fileoverview A rule to enforce no-force true in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

'use strict';

const { isCypressCall } = require('../cypress-support/called-by-cypress');
const { getFullCommentLineNumbers } = require('../comment-support/line-numbers');
const { deepCheck } = require('../cypress-support/chain-validator');

/**
 * Identifies if a node is an Identifier and is within the allowed methods.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function isCallingClickOrType(node) {
  const allowedMethods = ['click', 'dblclick', 'type', 'trigger', 'check', 'uncheck', 'rightclick', 'focus', 'select']
  if (node.property && node.property.type === 'Identifier' && allowedMethods.includes(node.property.name)) {
    return true
  }
}

/**
 * Identifies if a node is an ObjectExpression and has a force property.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function hasOptionForce(node) {
  if (node.arguments && node.arguments.some(arg => { return arg.type === 'ObjectExpression' && arg.properties.some(propNode => { return propNode.key && propNode.key.name === 'force' }) })) {
    return true;
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `force: true` with action commands',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected: 'Do not use force on click and type calls'
    },
    recommended: true
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const comments = getFullCommentLineNumbers(sourceCode.getAllComments(), sourceCode);

    /**
     * Check if the node is Cypress call and has option force: true.
     * @param {ASTNode} node
     * @private
     */
    function checkNodeIsCypressCallAndHasOptionForce(node) {
      if (isCypressCall(node) && deepCheck(node, isCallingClickOrType) && deepCheck(node, hasOptionForce) && !comments.has(node.loc.start.line - 1)) {
        context.report({ node, messageId: 'unexpected' })
      }
    }

    return {
      CallExpression: checkNodeIsCypressCallAndHasOptionForce}
  },
};