import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";

const TRAVERSAL_TYPES = new Set([
  "find",
  "parent",
  "children",
  "siblings",
  "closest",
  "parentNode",
  "childNodes",
  "nextSibling",
  "previousSibling",
  "querySelector",
  "querySelectorAll",
  "locator",
  "frameLocator",
]);

/**
 * Returns true if a MemberExpression property is a known traversal method
 */
function isTraversalPropertyCheck(node: TSESTree.Node): boolean {
  if (node.type === AST_NODE_TYPES.MemberExpression) {
    const prop = node.property;
    if (prop.type === AST_NODE_TYPES.Identifier) {
      return TRAVERSAL_TYPES.has(prop.name);
    }
  }
  return false;
}

/**
 * Check if a node represents a traversal method or property
 */
function isTraversal(node: TSESTree.Node): boolean {
  if (!node) return false;

  if (isTraversalPropertyCheck(node)) return true;

  if (node.type === AST_NODE_TYPES.CallExpression) {
    return isTraversalPropertyCheck(node.callee);
  }

  return false;
}

/**
 * Count consecutive traversal methods in a chain
 */
function countTraversalChain(node: TSESTree.Node | null): number {
  if (!node) return 0;

  const thisNodeCount = isTraversal(node) ? 1 : 0;

  if (
    node.type === AST_NODE_TYPES.CallExpression &&
    node.callee.type === AST_NODE_TYPES.MemberExpression
  ) {
    return thisNodeCount + countTraversalChain(node.callee.object);
  }

  if (node.type === AST_NODE_TYPES.MemberExpression) {
    return thisNodeCount + countTraversalChain(node.object);
  }

  return thisNodeCount;
}
/**
 * Returns true if the node is the outermost part of a chain (not nested in another call/member)
 */
function isTopmostChainNode(node: TSESTree.Node): boolean {
  const parent = (node as any).parent as TSESTree.Node | undefined;
  if (!parent) return true;

  if (
    parent.type === AST_NODE_TYPES.MemberExpression &&
    (parent as TSESTree.MemberExpression).object === node
  ) {
    return false;
  }

  if (
    parent.type === AST_NODE_TYPES.CallExpression &&
    (parent as TSESTree.CallExpression).callee === node
  ) {
    return false;
  }

  return true;
}

/**
 * Report the node if it contains 2 or more chained traversal methods
 */
function reportIfChainedTraversal(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<"noChainedTraversal", []>
): void {
  if (!isTopmostChainNode(node)) return;

  if (countTraversalChain(node) >= 2) {
    context.report({
      node,
      messageId: "noChainedTraversal",
    });
  }
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/bignited/b.strict-Linter-Typescript/blob/develop/docs/rules/${name}.md`
);

const rule = createRule({
  name: "no-chained-traversal",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disalow using 2 or more chained html traversals in a single selector.",
    },
    schema: [],
    messages: {
      noChainedTraversal:
        "Please, do not use 2 or more chained traversal methods.",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        reportIfChainedTraversal(node, context);
      },

      MemberExpression(node) {
        reportIfChainedTraversal(node, context);
      },
    };
  },
});

export default rule;
