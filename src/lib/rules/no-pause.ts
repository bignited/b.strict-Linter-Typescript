import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { getFullCommentLineNumbers } from "../comment-support/line-numbers";
import { isCypressCallChained } from "../cypress-support/called-by-cypress";
import { ESLint, RuleListener } from "@typescript-eslint/utils/ts-eslint";

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
  context: TSESLint.RuleContext<"noPause", []>
): void {
  const sourceCode = context.sourceCode;
  const comments = getFullCommentLineNumbers(
    sourceCode.getAllComments(),
    sourceCode
  );

  if (
    isCypressCallChained(node) &&
    isCallingPause(node) &&
    !comments.has(node.loc.start.line - 1)
  ) {
    context.report({ node, messageId: "noPause" });
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "noPause",
  meta: {
    type: "problem",
    docs: {
      description: "disallow using `cy.pause()` in Cypress tests",
    },
    fixable: "code",
    schema: [],
    messages: {
      noPause: "Do not use cy.pause()",
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
