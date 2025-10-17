import { TestCaseError } from "@typescript-eslint/rule-tester";

/**
 * Utility function to build expected ESLint test errors for RuleTester.
 *
 * Simplifies constructing the `errors` array used in test cases.
 * Supports either:
 *   - A count (to repeat the same error multiple times), or
 *   - A full `TestCaseError` object for custom assertions.
 */
export const err = <T extends string>(
  messageId: T,
  countOrError: number | object = 1,
  overrides: Partial<Omit<TestCaseError<T>, "messageId">> = {}
): TestCaseError<T>[] => {
  if (typeof countOrError === "object") {
    return [countOrError as TestCaseError<T>];
  }

  return Array.from({ length: countOrError }, () => ({
    messageId,
    ...overrides,
  })) as TestCaseError<T>[];
};
