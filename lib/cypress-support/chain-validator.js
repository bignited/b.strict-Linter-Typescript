/* eslint-disable complexity */
/**
 * Identifies if a node is a cypress call and has a force property.
 * @param {ASTNode} node Node to test.
 * @param {function} checkFunc Check function to run on the parent node
 * @returns 
 */
function deepCheck(node, checkFunc) {
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
  deepCheck
}