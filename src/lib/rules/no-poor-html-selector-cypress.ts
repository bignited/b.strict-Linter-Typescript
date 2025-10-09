import { ESLintUtils } from "@typescript-eslint/utils";
import { RuleListener } from "@typescript-eslint/utils/ts-eslint";

const createRule = ESLintUtils.RuleCreator((name) => name);

const rule = createRule({
  name: "noPoorHtmlSelectorCypress",
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow using poor html for selectors in cypress",
    },
    fixable: "code",
    schema: [],
    messages: {
      noPoorHtmlSelectorCypress: "Do not use poor html selectors",
    },
  },
  defaultOptions: [],
  create(context): RuleListener {
    return {
      CallExpression(node) {
        //
      },
    };
  },
});

export default rule;
