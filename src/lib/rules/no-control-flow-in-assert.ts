import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { isCallChainedFromNode } from "../utils/called-by-cypress.js";
import { isNode } from "../utils/check-node.js";
import { nodeHasFullLineCommentAbove } from "../utils/line-numbers.js";

const CONTROL_FLOW_TYPES = new Set([
  AST_NODE_TYPES.IfStatement,
  AST_NODE_TYPES.SwitchCase,
]);

/**
 * Determines whether a given call expression is an assertion callback (e.g., `expect(fn)` or `something.should(fn)` in Cypress)
 */
function isAssertionCallbackCall(node: TSESTree.CallExpression): boolean {
  const [firstArg] = node.arguments;

  const isFunctionArg =
    firstArg &&
    (firstArg.type === AST_NODE_TYPES.ArrowFunctionExpression ||
      firstArg.type === AST_NODE_TYPES.MemberExpression);

  if (!isFunctionArg) return false;

  if (
    node.callee.type === AST_NODE_TYPES.Identifier &&
    node.callee.name === "expect"
  ) {
    return true;
  }

  if (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.callee.property.name === "should"
  ) {
    return isCallChainedFromNode(node.callee.object, "cy");
  }

  return false;
}

/**
 * Recursively traverses an AST node and its children, reporting any control flow statements (like loops or conditionals) found within assertion callbacks
 */
function walkAndReportControlFlow(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<"noControlFlowInAssert", []>,
  visited = new Set<TSESTree.Node>()
): void {
  if (visited.has(node)) return;
  visited.add(node);

  if (
    CONTROL_FLOW_TYPES.has(node.type) &&
    !nodeHasFullLineCommentAbove<"noControlFlowInAssert">(node, context)
  ) {
    context.report({
      node,
      messageId: "noControlFlowInAssert",
    });
  }

  for (const key of Object.keys(node)) {
    const value = (node as any)[key];

    if (!value) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNode(item)) walkAndReportControlFlow(item, context, visited);
      }
    } else if (isNode(value)) walkAndReportControlFlow(value, context, visited);
  }
}

/**
 * Checks if a call expression is an assertion callback and, if so, reports any control flow statements inside its callback body
 */
function reportIfControlFlowInAssert(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noControlFlowInAssert", []>
): void {
  if (!isAssertionCallbackCall(node)) return;

  const [callBack] = node.arguments;

  if (
    callBack.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    callBack.type === AST_NODE_TYPES.FunctionExpression
  ) {
    if (callBack.body.type === AST_NODE_TYPES.BlockStatement) {
      walkAndReportControlFlow(callBack.body, context);
    }
  }
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/bignited/b.strict-Linter-Javascript/blob/develop/docs/rules/${name}.md`
);

const rule = createRule({
  name: "no-control-flow-in-assert",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disallow using control flow statements inside assert blocks",
    },
    schema: [],
    messages: {
      noControlFlowInAssert:
        "Do not use control flow statements inside assert blocks",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        reportIfControlFlowInAssert(node, context);
      },
    };
  },
});

export default rule;
