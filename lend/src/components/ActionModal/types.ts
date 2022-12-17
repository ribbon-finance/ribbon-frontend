export type ActionType = "deposit" | "withdraw" | "migrate" | "rebalance";

export const PoolValidationErrorList = [
  "insufficientBalance",
  "withdrawLimitExceeded",
  "migrateLimitExceeded",
  "insufficientPoolLiquidity",
] as const;

export type PoolValidationErrors = typeof PoolValidationErrorList[number];
