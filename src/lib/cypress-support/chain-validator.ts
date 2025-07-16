import { TSESTree } from "@typescript-eslint/utils";

/**
 * Identifies if a node is a cypress call and has a force property.
 */
export function deepCheck(
  node: TSESTree.Node,
  checkFunc: (nodeParent: TSESTree.Node) => boolean
): boolean {
  let currentNode: TSESTree.Node | undefined = node;

  while (currentNode.parent) {
    if (checkFunc(currentNode.parent)) {
      return true;
    }
    currentNode = currentNode.parent;
  }

  return false;
}
