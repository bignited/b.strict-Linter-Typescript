import { TSESTree } from "@typescript-eslint/utils";

/**
 * @fileoverview cypress helper functions for the bstrict plugin.
 * @author b.ignited
 */

/**
 * Identifies if a node is a cypress call.
 */
export function isCypressCall(node: TSESTree.CallExpression): boolean {
  return (
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "cy"
  );
}

/**
 * Identifies if a node is a cypress call and loops itself if condition isn't met.
 */
export function isCypressCallChained(
  node: TSESTree.Node | null | undefined
): boolean {
  if (
    node?.type === "CallExpression" &&
    node.callee.type === "MemberExpression"
  ) {
    const object = node.callee.object;

    if (object.type == "Identifier" && object.name === "cy") return true;

    return isCypressCallChained(object);
  }

  if (node?.type === "MemberExpression") {
    const object = node.object;

    if (object.type === "Identifier" && object.name === "cy") return true;

    return isCypressCallChained(object);
  }

  return false;
}
