import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import { getFullCommentLineNumbers } from "../comment-support/line-numbers";

/**
 * @fileoverview A rule to enforce no print statement calls.
 * @author b.ignited
 */

const prohibitedConsoleMethods = new Set(["log", "info", "warn", "error"]);

/**
 * Reports if the call expression is a disallowed `console` method
 * (e.g., console.log, console.info, console.warn, console.error).
 */
function reportIfConsoleCall(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noPrint", []>
) {
  const sourceCode = context.sourceCode;
  const comments = getFullCommentLineNumbers(
    sourceCode.getAllComments(),
    sourceCode
  );

  if (
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "console" &&
    node.callee.property.type === "Identifier" &&
    prohibitedConsoleMethods.has(node.callee.property.name) &&
    !comments.has(node.loc.start.line - 1)
  ) {
    context.report({
      node,
      messageId: "noPrint",
      data: {
        name: `console.${node.callee.property.name}`,
      },
    });
  }
}

/**
 * Reports if the call expression is a call to the global `alert()` function.
 */
function reportIfAlertCall(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noPrint", []>
) {
  const sourceCode = context.sourceCode;
  const comments = getFullCommentLineNumbers(
    sourceCode.getAllComments(),
    sourceCode
  );

  if (
    node.callee.type === "Identifier" &&
    node.callee.name === "alert" &&
    !comments.has(node.loc.start.line - 1)
  ) {
    context.report({
      node,
      messageId: "noPrint",
      data: {
        name: "alert",
      },
    });
  }
}

/**
 * Reports if the call expression is a call to `document.write()`.
 */
function reportIfDocumentWriteCall(
  node: TSESTree.CallExpression,
  context: TSESLint.RuleContext<"noPrint", []>
) {
  const sourceCode = context.sourceCode;
  const comments = getFullCommentLineNumbers(
    sourceCode.getAllComments(),
    sourceCode
  );

  if (
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "document" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "write" &&
    !comments.has(node.loc.start.line - 1)
  ) {
    context.report({
      node,
      messageId: "noPrint",
      data: {
        name: "document.write",
      },
    });
  }
}

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "noPrint",
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow print/debug statements like console.log, alert, etc.",
    },
    schema: [],
    messages: {
      noPrint: "Unexpected print statement: {{ name }}",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        reportIfConsoleCall(node, context);
        reportIfAlertCall(node, context);
        reportIfDocumentWriteCall(node, context);
      },
    };
  },
});

export default rule;
