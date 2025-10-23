import { createPoorSelectorRule } from "../factories/no-poor-html-selector.js";

const rule = createPoorSelectorRule({
  frameworkName: "Cypress",
  rootObjectName: "cy",
  entryFunctions: ["get", "xpath"],
});

export default rule;
