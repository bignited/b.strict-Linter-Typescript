import { TestCaseError } from "@typescript-eslint/rule-tester";

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
