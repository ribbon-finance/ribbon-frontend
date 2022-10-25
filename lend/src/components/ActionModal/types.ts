export type ActionType = "deposit" | "withdraw" | "rebalance";

export const PoolValidationErrorList = [
  "insufficientBalance",
  "withdrawLimitExceeded",
  "insufficientPoolLiquidity",
  "poolMaxCapacity",
] as const;

export type PoolValidationErrors = typeof PoolValidationErrorList[number];
