import { TSESLint, TSESTree } from "@typescript-eslint/utils";

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
