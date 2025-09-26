import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Type guard to check whether a value is a TSESTree AST node
 */
export function isNode(value: unknown): value is TSESTree.Node {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof (value as any).type === "string"
  );
}

/**
 * Type guard to check whether a value is an array of AST Nodes
 */
function isNodeArray(value: unknown): value is TSESTree.Node[] {
  return Array.isArray(value) && value.every(isNode);
}

/**
 * Recursively traverses an AST node and its children, counting call expressions that satisfy the given assertion check
 */
function checkNode(
  node: TSESTree.Node,
  isAssertion: (node: TSESTree.CallExpression) => boolean,
  countObj: { count: number }
): void {
  if (node.type === AST_NODE_TYPES.CallExpression && isAssertion(node)) {
    countObj.count++;
  }

  for (const key in node) {
    if (
      key === "parent" ||
      key === "loc" ||
      key === "range" ||
      key === "type" ||
      key === "tokens" ||
      key === "leadingComments" ||
      key === "trailingComments" ||
      key === "comments"
    ) {
      continue;
    }

    const value = node[key as keyof TSESTree.Node];

    if (isNodeArray(value)) {
      for (const element of value) {
        if (isNode(element)) {
          checkNode(element, isAssertion, countObj);
        }
      }
    } else if (isNode(value)) {
      checkNode(value, isAssertion, countObj);
    }
  }
}

/**
 * Counts the number of assertion call expressions within a given block statement
 */
export function countAssertions(
  block: TSESTree.BlockStatement,
  isAssertion: (node: TSESTree.CallExpression) => boolean
): number {
  const countObj = { count: 0 };
  block.body.forEach((node) => checkNode(node, isAssertion, countObj));
  return countObj.count;
}
