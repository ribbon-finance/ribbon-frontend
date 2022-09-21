export type ActionType = "deposit" | "withdraw";

export const PoolValidationErrorList = [
  "insufficientBalance",
  "withdrawLimitExceeded",
] as const;

export type PoolValidationErrors = typeof PoolValidationErrorList[number];
