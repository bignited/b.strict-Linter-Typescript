import { createPoorSelectorRule } from "../factories/no-poor-html-selector.js";

const rule = createPoorSelectorRule({
  frameworkName: "Playwright",
  rootObjectName: "page",
  entryFunctions: ["locator"],
});

export default rule;
