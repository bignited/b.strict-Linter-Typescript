import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { nodeHasFullLineCommentAbove } from "../comment-support/line-numbers";
import { isCypressCallChained } from "../cypress-support/called-by-cypress";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";

/**
 * @fileoverview A rule to enforce no cy.pause() calls in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

/**
 * Identifies if a node is an Identifier and has property name pause.
 */
function isCallingPause(node: TSESTree.Node): boolean {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "pause"
  );
}

/**
 * Reports if the node is Cypress call and is calling pause.
 */
function reportIfCypressPause(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noPauseCypress", []>
): void {
  if (
    isCypressCallChained(node) &&
    isCallingPause(node) &&
    !nodeHasFullLineCommentAbove<"noPauseCypress">(node, context)
  ) {
    context.report({
      node,
      messageId: "noPauseCypress",
    });
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "noPauseCypress",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow using `cy.pause()` in Cypress tests",
    },
    schema: [],
    messages: {
      noPauseCypress: "Do not use cy.pause()",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        reportIfCypressPause(node, context);
      },
    };
  },
});

export default rule;
