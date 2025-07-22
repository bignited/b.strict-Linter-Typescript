import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import { getFullCommentLineNumbers } from "../comment-support/line-numbers";
import type {
  Definition,
  Scope,
  Reference,
} from "@typescript-eslint/scope-manager";

/**
 * @fileoverview A rule to enforce no waiting time in Cypress tests, unless it is necessary for the test to pass you can put a comment above.
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
    def.node.type === "VariableDeclarator" &&
    !!def.node.init &&
    def.node.init.type === "Literal" &&
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
    param?.type === "AssignmentPattern" &&
    param.right.type === "Literal" &&
    typeof param.right.value === "number"
  );
}

/**
 * Identifies if a node is a MemberExpression, Is called by cy, Is an Identifier and property is wait.
 */
function isCallingCyWait(node: TSESTree.Node): boolean {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    nodeIsCalledByCy(node) &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "wait"
  );
}

/**
 * Identifies if a node is called by cy.
 */
function nodeIsCalledByCy(node: TSESTree.Node): boolean {
  if (node.type === "Identifier" && node.name === "cy") {
    return true;
  }

  if (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object
  ) {
    return nodeIsCalledByCy(node.callee.object);
  }

  if (node.type === "MemberExpression" && node.object) {
    return nodeIsCalledByCy(node.object);
  }

  return false;
}

/**
 * Identifies if a node is a number argument.
 */
function isNumberArgument(node: TSESTree.Node): boolean {
  if (
    node.type === "CallExpression" &&
    node.arguments.length > 0 &&
    node.arguments[0].type === "Literal" &&
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
  if (firstArg.type !== "Identifier") return false;

  const ref: Reference | undefined = scope.references.find(
    (ref) => ref.identifier === firstArg
  );

  const def = ref?.resolved?.defs?.[0];
  if (!def) return false;

  if (isVariableInitializedWithNumber(def)) return true;
  if (isParameterWithNumericDefault(def)) return true;

  return false;
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "no-unnecessary-waiting",
  meta: {
    type: "problem",
    docs: {
      description: "disallow unnecessary waiting",
    },
    fixable: "code",
    schema: [],
    messages: {
      noUnnecessaryWaiting: "Do not wait for arbitrary time periods",
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode;
    const comments = getFullCommentLineNumbers(
      sourceCode.getAllComments(),
      sourceCode
    );

    function checkNodeIsCallingCyWait(node: TSESTree.CallExpression): void {
      if (isCallingCyWait(node)) {
        const scope =
          sourceCode.scopeManager?.acquire(node) ?? sourceCode.getScope(node);

        if (
          isIdentifierNumberConstArgument(node, scope) ||
          (isNumberArgument(node) && !comments.has(node.loc.start.line - 1))
        ) {
          context.report({ node, messageId: "noUnnecessaryWaiting" });
        }
      }
    }

    return {
      CallExpression: checkNodeIsCallingCyWait,
    };
  },
});

export default rule;
