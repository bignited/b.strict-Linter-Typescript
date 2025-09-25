import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import type {
  Definition,
  Scope,
  Reference,
} from "@typescript-eslint/scope-manager";
import { nodeHasFullLineCommentAbove } from "../comment-support/line-numbers.js";

/**
 * @fileoverview A rule to enforce no waiting time in Cypress & Playwright tests, unless it is necessary for the test to pass you can put a comment above.
 * @author b.ignited
 */

/**
 * Type guard to check if definition is a VariableDeclarator with numeric init.
 */
function isVariableInitializedWithNumber(
  def: Definition
): def is Extract<Definition, { type: "Variable" }> {
  return (
    def.type === "Variable" &&
    def.node.type === AST_NODE_TYPES.VariableDeclarator &&
    !!def.node.init &&
    def.node.init.type === AST_NODE_TYPES.Literal &&
    typeof def.node.init.value === "number"
  );
}

/**
 * Type guard to check if definition is a function with numeric default.
 */
function isParameterWithNumericDefault(def: Definition): boolean {
  if (def.type !== "Parameter") return false;

  const param = def.name.parent;

  return (
    param?.type === AST_NODE_TYPES.AssignmentPattern &&
    param.right.type === AST_NODE_TYPES.Literal &&
    typeof param.right.value === "number"
  );
}

/**
 * Identifies if a node is a MemberExpression, Is called by cy, Is an Identifier and property is wait.
 */
function isCallingCyWait(node: TSESTree.Node): boolean {
  return (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    nodeIsCalledByCy(node) &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.callee.property.name === "wait"
  );
}

/**
 * Identifies if a node is called by cy.
 */
function nodeIsCalledByCy(node: TSESTree.Node): boolean {
  if (node.type === AST_NODE_TYPES.Identifier && node.name === "cy") {
    return true;
  }

  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.callee.object
  ) {
    return nodeIsCalledByCy(node.callee.object);
  }

  if (node.type === AST_NODE_TYPES.MemberExpression && node.object) {
    return nodeIsCalledByCy(node.object);
  }

  return false;
}

/**
 * Identifies if a node is a number argument.
 */
function isNumberArgument(node: TSESTree.Node): boolean {
  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.arguments.length > 0 &&
    node.arguments[0].type === AST_NODE_TYPES.Literal &&
    typeof node.arguments[0].value === "number"
  ) {
    return true;
  }
  return false;
}

/**
 * Identifies if a node is an identifier number const argument.
 */
function isIdentifierNumberConstArgument(
  node: TSESTree.CallExpression,
  scope: Scope
): boolean {
  if (node.arguments.length === 0) return false;

  const firstArg = node.arguments[0];
  if (firstArg.type !== AST_NODE_TYPES.Identifier) return false;

  const ref: Reference | undefined = scope.references.find(
    (ref) => ref.identifier === firstArg
  );

  const def = ref?.resolved?.defs?.[0];
  if (!def) return false;

  if (isVariableInitializedWithNumber(def)) return true;
  if (isParameterWithNumericDefault(def)) return true;

  return false;
}

/**
 * Reports if the node is Cypress call and is calling wait.
 */
function reportIfCypressWait(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noUnnecessaryWaitingCypress", []>
): void {
  const sourceCode = context.sourceCode;

  if (isCallingCyWait(node)) {
    const scope =
      sourceCode.scopeManager?.acquire(node) ?? sourceCode.getScope(node);

    if (
      (isIdentifierNumberConstArgument(node, scope) ||
        isNumberArgument(node)) &&
      !nodeHasFullLineCommentAbove<"noUnnecessaryWaitingCypress">(node, context)
    ) {
      context.report({
        node,
        messageId: "noUnnecessaryWaitingCypress",
      });
    }
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "no-unnecessary-waiting-cypress",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow unnecessary waiting in Cypress tests",
    },
    schema: [],
    messages: {
      noUnnecessaryWaitingCypress: "Do not wait for arbitrary time periods",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        reportIfCypressWait(node, context);
      },
    };
  },
});

export default rule;
