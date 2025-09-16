import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { countAssertions } from "../utils/check-node";

export function isPlaywrightAssertion(node: TSESTree.CallExpression): boolean {
  return node.callee.type === "Identifier" && node.callee.name === "expect";
}

export function isPlaywrightTestCall(callee: TSESTree.Node): boolean {
  return callee.type === "Identifier" && callee.name === "test";
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "oneAssertPerTestPlaywright",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow more than one assert inside a test block",
    },
    fixable: "code",
    schema: [],
    messages: {
      oneAssertPerTestPlaywright:
        "Do not use more than one assert inside your test",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        if (
          isPlaywrightTestCall(node.callee) &&
          node.arguments.length > 1 &&
          node.arguments[1].type === "ArrowFunctionExpression" &&
          node.arguments[1].body.type === "BlockStatement"
        ) {
          const block = node.arguments[1].body;
          const assertionCount = countAssertions(block, isPlaywrightAssertion);
          if (assertionCount > 1) {
            context.report({
              node,
              messageId: "oneAssertPerTestPlaywright",
            });
          }
        }
      },
    };
  },
});

export default rule;
