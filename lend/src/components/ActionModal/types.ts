export type ActionType = "deposit" | "withdraw";

export const PoolValidationErrorList = [
  "insufficientBalance",
  "withdrawLimitExceeded",
  "insufficientPoolLiquidity",
] as const;

export type PoolValidationErrors = typeof PoolValidationErrorList[number];
