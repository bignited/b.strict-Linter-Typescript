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
  if (node?.callee?.type === 'MemberExpression') {
    if (node.callee.object?.type === 'Identifier' && node.callee.object.name === 'cy') {
      return true;
    }
    return isCypressCallChained(node.callee.object);
  }
  return false;
}

module.exports = {
  isCypressCall,
  isCypressCallChained
}