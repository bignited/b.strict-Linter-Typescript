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
 * Returns true if there is a single-line comment (`// ...`) immediately above the node,
 * and that line contains no other code.
 */
export function nodeHasFullLineCommentAbove<
  T extends string,
  O extends readonly unknown[] = []
>(node: TSESTree.Node, context: TSESLint.RuleContext<T, O>): boolean {
  const sourceCode = context.sourceCode;

  const lineNumber = node.loc.start.line - 1;
  if (lineNumber < 1) return false;

  const lineText = sourceCode.lines[lineNumber - 1].trim();

  return lineText.startsWith("//");
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
