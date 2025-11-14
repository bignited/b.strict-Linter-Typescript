import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from "@typescript-eslint/utils";
import { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { isPoorSelector } from "../utils/selectors.js";
import { JSONSchema4 } from "@typescript-eslint/utils/json-schema";

const OPTIONS_SCHEMA: JSONSchema4 = {
  type: "object",
  properties: {
    pageObjectPattern: {
      type: "string",
      description:
        "Regex (string) pattern to match variable names treated as page objects. Default: 'page'",
    },
  },
  additionalProperties: false,
};

type NoPoorHtmlSelectorOptions = {
  pageObjectPattern?: string;
};

type PoorSelectorRuleConfig = {
  frameworkName: string;
  rootObjectName: string;
  entryFunctions: string[];
};

const DEFAULT_OBJECT_PATTERN = "page";

/**
 * Reports poor or fragile HTML selectors in framework calls like cy.get() or page.locator().
 */
function reportIfPoorHtmlSelectorInCallExpression(
  node: TSESTree.CallExpression,
  context: RuleContext<
    "noPoorHtmlSelector",
    readonly [NoPoorHtmlSelectorOptions]
  >,
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
      typeof firstArg.value === "string" &&
      isPoorSelector(firstArg.value)
    ) {
      context.report({
        node: firstArg,
        messageId: "noPoorHtmlSelector",
      });
    }
  }
}

/**
 * Reports poor selectors defined in page object–like variable declarations.
 */
function reportIfPoorHtmlSelectorInVariable(
  node: TSESTree.VariableDeclarator,
  context: RuleContext<
    "noPoorHtmlSelector",
    readonly [NoPoorHtmlSelectorOptions]
  >,
  pageObjectRegex: RegExp
) {
  if (
    node.id.type === AST_NODE_TYPES.Identifier &&
    node.init?.type === AST_NODE_TYPES.ObjectExpression &&
    pageObjectRegex.test(node.id.name)
  ) {
    for (const prop of node.init.properties) {
      if (
        prop.type === AST_NODE_TYPES.Property &&
        prop.value.type === AST_NODE_TYPES.Literal &&
        typeof prop.value.value === "string" &&
        isPoorSelector(prop.value.value)
      ) {
        context.report({ node: prop.value, messageId: "noPoorHtmlSelector" });
      }
    }
  }
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/bignited/b.strict-Linter-Javascript/blob/develop/docs/rules/${name}.md`
);

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
        description: `Disallow poor HTML selectors.`,
      },
      messages: {
        noPoorHtmlSelector: `Avoid complex or fragile HTML traversal selectors in ${frameworkName} tests.`,
      },
      schema: [OPTIONS_SCHEMA],
    },
    defaultOptions: [
      {
        pageObjectPattern: DEFAULT_OBJECT_PATTERN,
      },
    ],
    create(context, [userOptions]: readonly [NoPoorHtmlSelectorOptions]) {
      const pageObjectRegex = new RegExp(
        userOptions.pageObjectPattern ?? DEFAULT_OBJECT_PATTERN,
        "i"
      );

      return {
        CallExpression(node) {
          reportIfPoorHtmlSelectorInCallExpression(
            node,
            context,
            rootObjectName,
            entryFunctions
          );
        },
        VariableDeclarator(node) {
          reportIfPoorHtmlSelectorInVariable(node, context, pageObjectRegex);
        },
      };
    },
  });
}
