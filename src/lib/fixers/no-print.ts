import { TSESLint, TSESTree } from "@typescript-eslint/utils";

export function fixPrintStatement(
  node: TSESTree.Node,
  fixer: TSESLint.RuleFixer
) {
  const parent = node.parent;
  if (parent && parent.type === "ExpressionStatement") {
    return fixer.remove(parent);
  } else {
    return fixer.remove(node);
  }
}
