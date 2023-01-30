export const VaultValidationErrorList = [
  "insufficientBalance",
  "maxExceeded",
  "capacityOverflow",
  "withdrawLimitExceeded",
  "withdrawAmountStaked",
  "vaultFull",
  "maxDeposited",
  "allBalanceStaked",
  "withdrawLimitReached",
  "existingWithdraw",
  "minNotReached",
] as const;

export type VaultValidationErrors = typeof VaultValidationErrorList[number];

export const VaultInputValidationErrorList: Array<VaultValidationErrors> = [
  "insufficientBalance",
  "maxExceeded",
  "capacityOverflow",
  "withdrawLimitExceeded",
  "withdrawAmountStaked",
  "existingWithdraw",
  "minNotReached",
];
