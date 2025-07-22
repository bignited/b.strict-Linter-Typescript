import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { getFullCommentLineNumbers } from "../comment-support/line-numbers";
import { isCypressCall } from "../cypress-support/called-by-cypress";
import { deepCheck } from "../cypress-support/chain-validator";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";

/**
 * @fileoverview A rule to enforce no-force true in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

/**
 * Identifies if a node is an Identifier and is within the allowed methods.
 */
function isCallingClickOrType(node: TSESTree.Node): boolean {
  if (node.type !== "MemberExpression") return false;

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
  ];

  return (
    node.property.type === "Identifier" &&
    allowedMethods.includes(node.property.name)
  );
}

/**
 * Identifies if a node is an ObjectExpression and has a force property.
 */
function hasOptionForce(node: TSESTree.Node): boolean {
  if (node.type !== "CallExpression") return false;

  return node.arguments.some(
    (arg) =>
      arg.type === "ObjectExpression" &&
      arg.properties.some(
        (prop) =>
          prop.type === "Property" &&
          prop.key.type === "Identifier" &&
          prop.key.name === "force"
      )
  );
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "noForce",
  meta: {
    type: "problem",
    docs: {
      description: "disallow using `force: true` with action commands.",
    },
    fixable: "code",
    schema: [],
    messages: {
      noForce: "Do not use force on click and type calls.",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    const sourceCode = context.sourceCode;
    const comments = getFullCommentLineNumbers(
      sourceCode.getAllComments(),
      sourceCode
    );

    /**
     * Check if the node is Cypress call and has option force: true.
     */
    function checkNodeIsCypressCallAndHasOptionForce(
      node: TSESTree.CallExpression
    ): void {
      if (
        isCypressCall(node) &&
        deepCheck(node, isCallingClickOrType) &&
        deepCheck(node, hasOptionForce) &&
        !comments.has(node.loc.start.line - 1)
      ) {
        context.report({ node, messageId: "noForce" });
      }
    }

    return {
      CallExpression: checkNodeIsCypressCallAndHasOptionForce,
    };
  },
});

export default rule;
