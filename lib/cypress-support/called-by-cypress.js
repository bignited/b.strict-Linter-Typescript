/* eslint-disable complexity */
/**
 * @fileoverview cypress helper functions for the bstrict plugin.
 * @author b.ignited
 */

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
 * Identifies if a node is a cypress call and loops itself if condition isn't met.
 * @param {ASTNode} node Node to test.
 * @returns {boolean} True if it's condition is met.
 */
function isCypressCallChained(node) {
  return node.callee.type === 'MemberExpression' && (node.callee.object.name === 'cy' || isCypressCallChained(node.callee.object));
}

module.exports = {
  isCypressCall,
  isCypressCallChained
}