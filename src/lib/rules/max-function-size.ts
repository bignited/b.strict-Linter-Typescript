import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { nodeHasFullLineCommentAbove } from "../utils/line-numbers.js";
import { SourceCode } from "@typescript-eslint/utils/ts-eslint";

/**
 * @fileoverview A rule to enforce a maximum function size of 15 lines.
 * @author b.ignited
 */

type FunctionNodes =
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression;

type MaxFunctionSizeOptions = {
  maxLines?: number;
  callbackIgnores?: readonly string[];
  declarationIgnores?: readonly string[];
  methodIgnores?: readonly string[];
};

const OPTIONS_SCHEMA: JSONSchema4 = {
  type: "object",
  properties: {
    maxLines: { type: "integer", minimum: 1 },
    callbackIgnores: {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
    },
    declarationIgnores: {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
    },
    methodIgnores: {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
    },
  },
  additionalProperties: false,
};

const DEFAULT_CALLBACK_IGNORES = [
  "describe",
  "context",
  "it",
  "test",
  "before",
  "beforeEach",
  "beforeAll",
  "after",
  "afterEach",
  "afterAll",
] as const;

const DEFAULT_MAX_LINES = 15;

/**
 * Identifies if a function callback should be ignored by its name
 */
function shouldIgnoreCallBack(
  node: FunctionNodes,
  ignored_keywords: Set<string>
): boolean {
  const parent = node.parent;

  if (!parent) return false;

  if (parent.type !== AST_NODE_TYPES.CallExpression) return false;

  const callee = parent.callee;

  if (
    callee.type === AST_NODE_TYPES.Identifier &&
    ignored_keywords.has(callee.name)
  )
    return true;

  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    ignored_keywords.has(callee.property.name)
  ) {
    return true;
  }

  return false;
}

/**
 * Identifies if a function declaration should be ignored by its name
 */
function shouldIgnoreDeclaration(
  node: FunctionNodes,
  ignored_keywords: Set<string>
): boolean {
  if (
    (node.type === AST_NODE_TYPES.FunctionDeclaration ||
      node.type === AST_NODE_TYPES.FunctionExpression) &&
    node.id?.type === AST_NODE_TYPES.Identifier &&
    ignored_keywords.has(node.id.name)
  ) {
    return true;
  }

  if (
    node.type === AST_NODE_TYPES.ArrowFunctionExpression &&
    node.parent.type === AST_NODE_TYPES.VariableDeclarator &&
    node.parent.id.type === AST_NODE_TYPES.Identifier &&
    ignored_keywords.has(node.parent.id.name)
  ) {
    return true;
  }

  return false;
}

/**
 * Identifies if a class method should be ignored by its name
 */
function shouldIgnoreMethod(
  node: FunctionNodes,
  ignored_keywords: Set<string>
) {
  const parent = node.parent;

  if (
    parent.type === AST_NODE_TYPES.MethodDefinition &&
    parent.key.type === AST_NODE_TYPES.Identifier &&
    ignored_keywords.has(parent.key.name)
  ) {
    return true;
  }

  if (
    parent.type === AST_NODE_TYPES.PropertyDefinition &&
    parent.key.type === AST_NODE_TYPES.Identifier &&
    ignored_keywords.has(parent.key.name)
  ) {
    return true;
  }

  return false;
}

/**
 * Given a list of comment nodes, return a map with numeric keys and comment token values.
 */
export function getFullCommentLineNumbers(
  comments: TSESTree.Comment[],
  sourceCode: SourceCode
): Map<number, TSESTree.Comment> {
  const map = new Map<number, TSESTree.Comment>();

  for (const comment of comments) {
    for (
      let line = comment.loc.start.line;
      line <= comment.loc.end.line;
      line++
    ) {
      // Check if is full line comment
      if (
        comment.loc.start.column === 0 &&
        comment.loc.end.column === sourceCode.lines[line - 1].length
      ) {
        map.set(line, comment);
      }
    }
  }

  return map;
}

/**
 * Identifies if a node is a FunctionExpression which is embedded within a MethodDefinition or Property
 */
function isEmbedded(node: FunctionNodes): boolean {
  const parent = node.parent;

  if (!parent) {
    return false;
  }

  if (
    parent.type === AST_NODE_TYPES.MethodDefinition &&
    parent.value === node
  ) {
    return false;
  }

  if (parent.type === AST_NODE_TYPES.Property && parent.value === node) {
    return (
      parent.method === true || parent.kind === "get" || parent.kind === "set"
    );
  }

  return false;
}

/**
 * Identifies if a node is a FunctionExpression which is part of an IIFE
 */
function isIIFE(node: FunctionNodes): boolean {
  return (
    node.parent?.type === AST_NODE_TYPES.CallExpression &&
    node.parent.callee === node
  );
}

/**
 * Validate the lines in a function
 */
function validateLines(
  node: TSESTree.Node,
  lines: string[],
  commentLineNumbers: Map<number, TSESTree.Comment>
) {
  let lineCount = 0;
  for (let i = node.loc.start.line - 1; i < node.loc.end.line; i++) {
    const line = lines[i];

    if (commentLineNumbers.has(i + 1)) {
      continue;
    }

    if (line.match(/^[\[\]\(\)\{\};,\s]*$/u)) {
      continue;
    }

    lineCount++;
  }
  return lineCount;
}

/**
 * Reports if the function size exceeds the maximum lines allowed
 */
function reportIfFunctionSizeExceedsLines(
  funcNode: FunctionNodes,
  context: TSESLint.RuleContext<
    "maxFunctionSize",
    readonly [MaxFunctionSizeOptions]
  >,
  maxLines: number,
  callbackIgnores: readonly string[],
  declarationIgnores?: readonly string[],
  methodIgnores?: readonly string[]
): void {
  const sourceCode = context.sourceCode;
  const lines = sourceCode.lines;

  const ignoredCallBacks = new Set(callbackIgnores);
  const ignoredDeclarations = new Set(declarationIgnores);
  const ignoredMethods = new Set(methodIgnores);

  if (
    shouldIgnoreCallBack(funcNode, ignoredCallBacks) ||
    shouldIgnoreDeclaration(funcNode, ignoredDeclarations) ||
    shouldIgnoreMethod(funcNode, ignoredMethods)
  )
    return;

  const commentLineNumbers = getFullCommentLineNumbers(
    sourceCode.getAllComments(),
    sourceCode
  );

  const node = isEmbedded(funcNode) ? funcNode.parent : funcNode;

  if (
    node.type === AST_NODE_TYPES.FunctionExpression ||
    node.type === AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    if (isIIFE(node)) return;
  }

  const lineCount = validateLines(node, lines, commentLineNumbers) - 1;

  if (
    lineCount >= maxLines &&
    !nodeHasFullLineCommentAbove<
      "maxFunctionSize",
      readonly [MaxFunctionSizeOptions]
    >(node, context)
  ) {
    context.report({
      node,
      messageId: "maxFunctionSize",
      data: { maxLines, lineCount },
    });
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "maxFunctionSize",
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce a maximum function size of 15 lines.",
    },
    schema: [OPTIONS_SCHEMA],
    messages: {
      maxFunctionSize:
        "Please, reduce the size of this method. A method can not contain more than {{maxLines}} lines. Currently, it has {{lineCount}} lines.",
    },
  },
  defaultOptions: [
    {
      maxLines: DEFAULT_MAX_LINES,
      callbackIgnores: [...DEFAULT_CALLBACK_IGNORES],
    },
  ],
  create(context, [userOptions]: readonly [MaxFunctionSizeOptions] = [{}]) {
    const options = {
      maxLines: userOptions.maxLines ?? DEFAULT_MAX_LINES,
      callbackIgnores: userOptions.callbackIgnores ?? [
        ...DEFAULT_CALLBACK_IGNORES,
      ],
      declarationIgnores: userOptions.declarationIgnores,
      methodIgnores: userOptions.methodIgnores,
    };

    const { maxLines, callbackIgnores, declarationIgnores, methodIgnores } =
      options;

    return {
      FunctionDeclaration(node) {
        reportIfFunctionSizeExceedsLines(
          node,
          context,
          maxLines,
          callbackIgnores,
          declarationIgnores,
          methodIgnores
        );
      },
      FunctionExpression(node) {
        reportIfFunctionSizeExceedsLines(
          node,
          context,
          maxLines,
          callbackIgnores,
          declarationIgnores,
          methodIgnores
        );
      },
      ArrowFunctionExpression(node) {
        reportIfFunctionSizeExceedsLines(
          node,
          context,
          maxLines,
          callbackIgnores,
          declarationIgnores,
          methodIgnores
        );
      },
    };
  },
});

export default rule;
