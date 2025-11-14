import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { nodeHasFullLineCommentAbove } from "../utils/line-numbers.js";
import { isCallChainedFromNode } from "../utils/called-by-cypress.js";

/**
 * @fileoverview A rule to enforce no cy.pause() calls in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

/**
 * Identifies if a node is an Identifier and has property name pause.
 */
function isCallingPause(node: TSESTree.Node): boolean {
  return (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
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
    isCallChainedFromNode(node, "cy") &&
    isCallingPause(node) &&
    !nodeHasFullLineCommentAbove<"noPauseCypress">(node, context)
  ) {
    context.report({
      node,
      messageId: "noPauseCypress",
    });
  }
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/bignited/b.strict-Linter-Javascript/blob/develop/docs/rules/${name}.md`
);

const rule = createRule({
  name: "no-pause-cypress",
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
