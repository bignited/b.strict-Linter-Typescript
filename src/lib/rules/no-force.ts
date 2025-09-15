import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { nodeHasFullLineCommentAbove } from "../comment-support/line-numbers";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";

/**
 * @fileoverview A rule to enforce no-force true in Cypress and Playwright tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

/**
 * Identifies if a node is an Identifier and is within the allowed methods.
 */
function isCallingAllowedMethod(node: TSESTree.Node): boolean {
  if (node.type !== "MemberExpression") return false;
  if (node.property.type !== "Identifier") return false;

  const allowedMethods = [
    "click",
    "dblclick",
    "type",
    "trigger",
    "check",
    "uncheck",
    "rightclick",
    "focus",
    "select",
    "fill",
  ];

  const methodName = node.property.name;
  return allowedMethods.includes(methodName);
}

/**
 * Identifies if a node is an ObjectExpression and has a force property.
 */
function hasOptionForceTrue(node: TSESTree.Node): boolean {
  if (node.type !== "CallExpression") return false;

  return node.arguments.some((arg) => {
    if (arg.type !== "ObjectExpression") return false;

    return arg.properties.some((prop) => {
      return (
        prop.type === "Property" &&
        prop.key.type === "Identifier" &&
        prop.key.name === "force" &&
        prop.value.type === "Literal" &&
        prop.value.value === true
      );
    });
  });
}

/**
 * Reports if the node is calling an action command that has option force: true.
 */
function reportIfForcedActionCommand(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noForce", []>
) {
  if (
    node.callee.type === "MemberExpression" &&
    isCallingAllowedMethod(node.callee) &&
    hasOptionForceTrue(node) &&
    !nodeHasFullLineCommentAbove<"noForce">(node, context)
  ) {
    context.report({ node, messageId: "noForce" });
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "noForce",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow using `force: true` with action commands.",
    },
    schema: [],
    messages: {
      noForce: "Do not use force on click and type calls.",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        reportIfForcedActionCommand(node, context);
      },
    };
  },
});

export default rule;
