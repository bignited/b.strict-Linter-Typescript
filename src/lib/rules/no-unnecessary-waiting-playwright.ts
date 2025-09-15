import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { nodeHasFullLineCommentAbove } from "../comment-support/line-numbers";

/**
 * @fileoverview A rule to enforce no waiting time in Cypress & Playwright tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

/**
 * Identifies if a node is a MemberExpression, Is called by page, Is an Identifier and property is waitForTimeout.
 */
function isCallingPageWaitForTimeout(node: TSESTree.CallExpression): boolean {
  const callee = node.callee;

  return (
    callee.type === "MemberExpression" &&
    callee.object.type === "Identifier" &&
    callee.object.name === "page" &&
    callee.property.type === "Identifier" &&
    callee.property.name === "waitForTimeout"
  );
}

/**
 * Reports if the node is page call and is calling waitForTimeout.
 */
function reportIfPlaywrightWait(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noUnnecessaryWaitingPlaywright", []>
): void {
  if (
    isCallingPageWaitForTimeout(node) &&
    !nodeHasFullLineCommentAbove<"noUnnecessaryWaitingPlaywright">(
      node,
      context
    )
  ) {
    context.report({
      node,
      messageId: "noUnnecessaryWaitingPlaywright",
    });
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "no-unnecessary-waiting-playwright",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow unnecessary waiting",
    },
    schema: [],
    messages: {
      noUnnecessaryWaitingPlaywright: "Do not wait for arbitrary time periods",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        reportIfPlaywrightWait(node, context);
      },
    };
  },
});

export default rule;
