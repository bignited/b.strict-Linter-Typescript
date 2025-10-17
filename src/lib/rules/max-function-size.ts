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

const OPTIONS_SCHEMA: JSONSchema4 = {
  oneOf: [
    {
      type: "integer",
      minimum: 1,
    },
  ],
};

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
  context: TSESLint.RuleContext<"maxFunctionSize", [number]>,
  maxLines: number
): void {
  const sourceCode = context.sourceCode;
  const lines = sourceCode.lines;

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
    !nodeHasFullLineCommentAbove<"maxFunctionSize", [number]>(node, context)
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
  defaultOptions: [15],
  create(context, [maxLines]) {
    return {
      FunctionDeclaration(node) {
        reportIfFunctionSizeExceedsLines(node, context, maxLines);
      },
      FunctionExpression(node) {
        reportIfFunctionSizeExceedsLines(node, context, maxLines);
      },
      ArrowFunctionExpression(node) {
        reportIfFunctionSizeExceedsLines(node, context, maxLines);
      },
    };
  },
});

export default rule;
