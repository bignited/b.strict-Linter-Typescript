/* eslint-disable complexity */
/**
 * @fileoverview A rule to enforce no-force true in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

'use strict';

/**
 * Given a list of comment nodes, return a map with numeric keys and comment token values.
 * @param {Array} comments An array of comment nodes.
 * @returns {Map<string, Node>} A map with numeric keys and comment token values.
 */
function getFullCommentLineNumbers(comments, sourceCode) {
  const map = new Map();

  comments.forEach(comment => {
    for (let i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
      const isFullLineComment = checkFullLineComment(comment, i, sourceCode);

      if (isFullLineComment) {
        map.set(i, comment);
      }
    };
  });
  return map;
}

/**
 * Identifies if a comment encompasses the entire line.
 * @param {comment} comment Comment node to test.
 * @param {number} lineNumber The one-indexed line number this is on.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} True if it's condition is met.
 */
function checkFullLineComment(comment, lineNumber, sourceCode) {
  const lineContent = sourceCode.lines[lineNumber - 1]
  const lineLength = lineContent.length
  const commentStartsAtBeginningOfLine = comment.loc.start.column === 0;
  const commentEndsAtEndOfLine = comment.loc.end.column === lineLength;

  return commentStartsAtBeginningOfLine && commentEndsAtEndOfLine
}

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
 * Identifies if a node is a cypress call.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function isCypressCall(node) {
  if (node.callee.type === 'MemberExpression' && node.callee.object.type === 'Identifier' && node.callee.object.name === 'cy') {
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

/**
 * Identifies if a node is a cypress call and has a force property.
 * @param {ASTNode} node Node to test.
 * @param {function} checkFunc Check function to run on the parent node
 * @returns 
 */
function deepCheck (node, checkFunc) {
  let currentNode = node

  while (currentNode.parent) {
    if (checkFunc(currentNode.parent)) {
      return true
    }
    currentNode = currentNode.parent
  }
  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `force: true` with action commands'
    },
    fixable: 'code',
    schema: [],
    recommended: true,
    messages: {
      unexpected: 'Do not use force on click and type calls'
    }
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

    return {CallExpression: checkNodeIsCypressCallAndHasOptionForce}
  },
};