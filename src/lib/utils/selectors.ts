/**
 * Checks if a selector string contains multiple traversal combinators (> + ~).
 */
function hasMultipleTraversalCombinators(selector: string): boolean {
  const matches = selector.match(/[>+~]/g);
  return !!(matches && matches.length > 1);
}

/**
 * Checks if an XPath selector is too deeply nested.
 */
function isDeepXPath(selector: string): boolean {
  if (!selector.startsWith("/")) return false;
  const cleaned = selector.replace(/^\/+/, "");
  const segments = cleaned.split("/").filter(Boolean);
  return segments.length > 2;
}

/**
 * Checks for usage of CSS positional selectors like :nth-child().
 */
function usesNthChild(selector: string): boolean {
  return /:nth-child\(/.test(selector);
}

/**
 * Detects random alphanumeric class names (e.g. .card-123abc).
 */
function hasRandomizedClass(selector: string): boolean {
  return /\.[A-Za-z]+-\d+[A-Za-z0-9]+/.test(selector);
}

/**
 * Detects fragile, framework-based classes (.btn.btn-primary).
 */
function usesFrameworkClass(selector: string): boolean {
  return /\.btn(\.|$)/.test(selector);
}

/**
 * Main public helper — determines if a selector violates good practices.
 */
export function isPoorSelector(selector: string): boolean {
  return (
    hasMultipleTraversalCombinators(selector) ||
    isDeepXPath(selector) ||
    usesNthChild(selector) ||
    hasRandomizedClass(selector) ||
    usesFrameworkClass(selector)
  );
}
