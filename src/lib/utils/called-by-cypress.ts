import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Recursively checks whether a given AST node is part of a chained call
 * that originates from a specific identifier (e.g. `cy`, `page`).
 */
export function isCallChainedFromNode(
  node: TSESTree.Node | null | undefined,
  nodeName?: string
): boolean {
  if (!node) return false;

  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression
  ) {
    return isCallChainedFromNode(node.callee.object, nodeName);
  }

  if (node.type === AST_NODE_TYPES.MemberExpression) {
    return isCallChainedFromNode(node.object, nodeName);
  }

  return node.type === AST_NODE_TYPES.Identifier && node.name === nodeName;
}
