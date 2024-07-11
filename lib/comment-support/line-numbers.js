/* eslint-disable complexity */
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

module.exports = {
  getFullCommentLineNumbers
}