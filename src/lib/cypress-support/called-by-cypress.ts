import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * @fileoverview cypress helper functions for the bstrict plugin.
 * @author b.ignited
 */

/**
 * Identifies if a node is a cypress call.
 */
export function isCypressCall(node: TSESTree.CallExpression): boolean {
  return (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.object.type === AST_NODE_TYPES.Identifier &&
    node.callee.object.name === "cy"
  );
}

/**
 * Identifies if a node is a cypress call and loops itself if condition isn't met.
 */
export function isCypressCallChained(
  node: TSESTree.Node | null | undefined
): boolean {
  if (!node) return false;

  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression
  ) {
    return isCypressCallChained(node.callee.object);
  }

  if (node.type === AST_NODE_TYPES.MemberExpression) {
    return isCypressCallChained(node.object);
  }

  return node.type === AST_NODE_TYPES.Identifier && node.name === "cy";
}
