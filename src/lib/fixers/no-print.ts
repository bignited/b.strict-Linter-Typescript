import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";

/**
 * Fixes no-print rule by removing the whole print statement line.
 */
export function fixPrintStatement(
  node: TSESTree.Node,
  fixer: TSESLint.RuleFixer
) {
  const parent = node.parent;
  if (parent && parent.type === AST_NODE_TYPES.ExpressionStatement) {
    return fixer.remove(parent);
  } else {
    return fixer.remove(node);
  }
}
