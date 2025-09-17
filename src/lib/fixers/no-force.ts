import { TSESLint, TSESTree } from "@typescript-eslint/utils";

/**
 * Fixes no-force rule by removing the { force: true } argument from the action method.
 */
export function fixNoForce(
  node: TSESTree.CallExpression,
  fixer: TSESLint.RuleFixer,
  context: TSESLint.RuleContext<"noForce", []>
) {
  const sourceCode = context.sourceCode;
  const args = node.arguments;

  for (const arg of args) {
    if (arg.type === "ObjectExpression" && arg.properties.length === 1) {
      const prop = arg.properties[0];

      if (
        prop.type === "Property" &&
        prop.key.type === "Identifier" &&
        prop.key.name === "force" &&
        prop.value.type === "Literal" &&
        prop.value.value === true
      ) {
        const nextToken = sourceCode.getTokenAfter(arg);
        const prevToken = sourceCode.getTokenBefore(arg);

        if (nextToken && nextToken.value === ",") {
          return fixer.removeRange([arg.range[0], nextToken.range[1]]);
        } else if (prevToken && prevToken.value === ",") {
          return fixer.removeRange([prevToken.range[0], arg.range[1]]);
        } else {
          return fixer.remove(arg);
        }
      }
    }
  }

  return null;
}
