import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isPoorSelector } from "../utils/selectors";

/**
 * Reports poor or fragile HTML selectors used in test frameworks.
 */
function reportIfPoorHtmlSelector(
  node: TSESTree.CallExpression,
  context: RuleContext<"noPoorHtmlSelector", []>,
  rootObjectName: string,
  entryFunctions: string[]
) {
  if (
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.object.type === AST_NODE_TYPES.Identifier &&
    node.callee.object.name === rootObjectName &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    entryFunctions.includes(node.callee.property.name)
  ) {
    const [firstArg] = node.arguments;
    if (
      firstArg &&
      firstArg.type === AST_NODE_TYPES.Literal &&
      typeof firstArg.value === "string"
    ) {
      const selector = firstArg.value;
      if (isPoorSelector(selector)) {
        context.report({
          node: firstArg,
          messageId: "noPoorHtmlSelector",
        });
      }
    }
  }
}

interface PoorSelectorRuleConfig {
  frameworkName: string;
  rootObjectName: string;
  entryFunctions: string[];
}

const createRule = ESLintUtils.RuleCreator((name) => name);

/**
 * Factory that creates a framework-specific rule
 * for detecting poor HTML selectors in test frameworks.
 */
export function createPoorSelectorRule({
  frameworkName,
  rootObjectName,
  entryFunctions,
}: PoorSelectorRuleConfig) {
  return createRule({
    name: `no-poor-html-selector-${frameworkName.toLowerCase()}`,
    meta: {
      type: "suggestion",
      docs: {
        description: `Disallow poor HTML selectors in ${frameworkName} tests.`,
      },
      messages: {
        noPoorHtmlSelector: `Avoid complex or fragile HTML traversal selectors in ${frameworkName} tests.`,
      },
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      return {
        CallExpression(node) {
          reportIfPoorHtmlSelector(
            node,
            context,
            rootObjectName,
            entryFunctions
          );
        },
      };
    },
  });
}
