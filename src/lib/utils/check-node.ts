import { TSESTree } from "@typescript-eslint/utils";

function isNode(value: unknown): value is TSESTree.Node {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof (value as any).type === "string"
  );
}

function checkNode(
  node: TSESTree.Node,
  isAssertion: (node: TSESTree.CallExpression) => boolean,
  countObj: { count: number }
): void {
  if (node.type === "CallExpression" && isAssertion(node)) {
    countObj.count++;
  }

  for (const key in node) {
    if (
      key === "parent" ||
      key === "loc" ||
      key === "range" ||
      key === "comments" ||
      key === "tokens" ||
      key === "leadingComments" ||
      key === "trailingComments"
    ) {
      continue;
    }

    const value = (node as any)[key];

    if (Array.isArray(value)) {
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

export function countAssertions(
  block: TSESTree.BlockStatement,
  isAssertion: (node: TSESTree.CallExpression) => boolean
): number {
  const countObj = { count: 0 };
  block.body.forEach((node) => checkNode(node, isAssertion, countObj));
  return countObj.count;
}
