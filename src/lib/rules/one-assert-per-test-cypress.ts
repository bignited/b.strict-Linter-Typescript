import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { countAssertions } from "../utils/check-node.js";

/**
 * Determines whether the given call expression is a Cypress assertion, such as `expect()` or `should()`.
 */
function isCypressAssertion(node: TSESTree.CallExpression): boolean {
  if (node.callee.type === AST_NODE_TYPES.Identifier) {
    return node.callee.name === "expect";
  }

  if (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.callee.property.name === "should"
  ) {
    return true;
  }

  return false;
}

/**
 * Determines whether the given callee node represents a Cypress test declaration, such as `it()`.
 */
function isCypressTestCall(callee: TSESTree.Node): boolean {
  return callee.type === AST_NODE_TYPES.Identifier && callee.name === "it";
}

/**
 * Reports if more than one direct assert is found inse the Cypress test block.
 */
function reportIfMoreThanOneAssertion(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"oneAssertPerTestCypress", []>
) {
  if (
    isCypressTestCall(node.callee) &&
    node.arguments.length > 1 &&
    node.arguments[1].type === AST_NODE_TYPES.ArrowFunctionExpression &&
    node.arguments[1].body.type === AST_NODE_TYPES.BlockStatement
  ) {
    const block = node.arguments[1].body;
    const assertionCount = countAssertions(block, isCypressAssertion);
    if (assertionCount > 1) {
      context.report({
        node,
        messageId: "oneAssertPerTestCypress",
      });
    }
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "oneAssertPerTestCypress",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow more than one assert inside a test block",
    },
    fixable: "code",
    schema: [],
    messages: {
      oneAssertPerTestCypress:
        "Do not use more than one assert inside your test",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        reportIfMoreThanOneAssertion(node, context);
      },
    };
  },
});

export default rule;
