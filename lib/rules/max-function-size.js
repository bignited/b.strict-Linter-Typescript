/* eslint-disable complexity */
/* eslint-disable bstrict/max-function-size */

/**
* @fileoverview A rule to enforce a maximum function size of 10 lines.
* @author b.ignited
*/

'use strict';

const { getFullCommentLineNumbers } = require('../comment-support/line-numbers');

const OPTIONS_SCHEMA = {
  oneOf: [
    {
      type: 'integer',
      minimum: 1
    }
  ]
}

/**
 * Identifies if a node is a FunctionExpression which is embedded within a MethodDefinition or Property
* @param {ASTNode} node Node to test
* @returns {boolean} True if it's a FunctionExpression embedded within a MethodDefinition or Property
*/
function isEmbedded(node) {
  if (!node.parent) {
    return false;
  };
  if (node !== node.parent.value) {
    return false;
  };
  if (node.parent.type === 'MethodDefinition') {
    return true;
  };
  if (node.parent.type === 'Property') {
    return node.parent.method === true || node.parent.kind === 'get' || node.parent.kind === 'set';
  };
  return false;
}

/**
 * Identifies if a node is a FunctionExpression which is part of an IIFE
 * @param {ASTNode} node Node to test
 * @returns {boolean} True if it's an IIFE
 */
function isIIFE(node) {
  return (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') && node.parent && node.parent.type === 'CallExpression' && node.parent.callee === node;
}

/**
 * Validate the lines in a function
 * @param {ASTNode} node AST node of the function
 * @param {string[]} lines Array of source code lines
 * @param {Map<string, Node>} commentLineNumbers Map with numeric keys and comment token values
 * @returns {number} Number of lines in the function
 */
function validateLines(node, lines, commentLineNumbers) {
  let lineCount = 0;
  for (let i = node.loc.start.line - 1; i < node.loc.end.line; i++) {
    const line = lines[i];

    if (commentLineNumbers.has(i + 1)) {
      continue;
    };

    if (line.match(/^[\[\]\(\)\{\};,\s]*$/u)) {
      continue;
    };

    lineCount++;
  }
  return lineCount;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce a maximum function size of 15 lines.',
    },
    fixable: 'code',
    schema: [
      OPTIONS_SCHEMA
    ],
    recommended: true,
    messages: {
      exceed: 'Please, reduce the size of this method. A method can not contain more than {{maxLines}} lines. Currently, it has {{lineCount}} lines.'
    }
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const lines = sourceCode.lines;

    const option = context.options[0];
    let maxLines = 15;

    if (typeof option === 'number') {
      maxLines = option;
    }

    const commentLineNumbers = getFullCommentLineNumbers(sourceCode.getAllComments(), sourceCode);

    /**
     * Count the lines in the function
     * @param {ASTNode} funcNode Function AST node
     * @private
     */
    function countLinesInFunction(funcNode) {
      const node = isEmbedded(funcNode) ? funcNode.parent : funcNode;
      if (isIIFE(node)) {
        return;
      };
      const lineCount = validateLines(node, lines, commentLineNumbers) - 1;
      if (lineCount >= maxLines) {
        context.report({
          node,
          messageId: 'exceed',
          data: { lineCount, maxLines }
        });
      };
    }

    return {
      FunctionDeclaration: countLinesInFunction,
      FunctionExpression: countLinesInFunction,
      ArrowFunctionExpression: countLinesInFunction
    };
  }
};