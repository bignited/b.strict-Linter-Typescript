/* eslint-disable complexity */
/**
 * @fileoverview A rule to enforce no cy.pause() calls in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

'use strict';

const { isCypressCallLoop } = require('../cypress-support/called-by-cypress');
const { getFullCommentLineNumbers } = require('../comment-support/line-numbers');

/**
 * Identifies if a node is an Identifier and has property name pause.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function isCallingPause (node) {
  return node.callee && node.callee.property && node.callee.property.type === 'Identifier' && node.callee.property.name === 'pause';
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `cy.pause()` in Cypress tests',
    },
    fixable: 'code',
    schema: [],
    messages: {
      unexpected: 'Do not use cy.pause()'
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const comments = getFullCommentLineNumbers(sourceCode.getAllComments(), sourceCode);

    /**
     * Check if the node is Cypress call and is calling pause.
     * @param {ASTNode} node
     * @private
     */
    function checkNodeIsCypressCallAndCallsPause (node) {
      if (isCypressCallLoop(node) && isCallingPause(node) && !comments.has(node.loc.start.line - 1)) {
        context.report({ node, messageId: 'unexpected' });
      }
    }

    return {
      CallExpression: checkNodeIsCypressCallAndCallsPause
    }
  }
};