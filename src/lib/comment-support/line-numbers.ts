import { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { SourceCode } from "@typescript-eslint/utils/ts-eslint";

/**
 * Given a list of comment nodes, return a map with numeric keys and comment token values.
 */
export function getFullCommentLineNumbers(
  comments: TSESTree.Comment[],
  sourceCode: SourceCode
): Map<number, TSESTree.Comment> {
  const map = new Map<number, TSESTree.Comment>();

  for (const comment of comments) {
    for (
      let line = comment.loc.start.line;
      line <= comment.loc.end.line;
      line++
    ) {
      if (isFullLineComment(comment, line, sourceCode)) {
        map.set(line, comment);
      }
    }
  }

  return map;
}

/**
 * Returns if the node has a full line comment above.
 */
export function nodeHasFullLineCommentAbove<T extends string>(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<T, []>
): boolean {
  const sourceCode = context.sourceCode;
  const comments = getFullCommentLineNumbers(
    sourceCode.getAllComments(),
    sourceCode
  );

  return comments.has(node.loc.start.line - 1);
}

/**
 * Identifies if a comment encompasses the entire line.
 */
function isFullLineComment(
  comment: TSESTree.Comment,
  lineNumber: number,
  sourceCode: SourceCode
): boolean {
  const line = sourceCode.lines[lineNumber - 1];

  return (
    comment.loc.start.column === 0 && comment.loc.end.column === line.length
  );
}
