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
  "eixstingWithdraw",
  "minNotReached",
] as const;

export type VaultValidationErrors = typeof VaultValidationErrorList[number];

export const VaultInputValidationErrorList: Array<VaultValidationErrors> = [
  "insufficientBalance",
  "maxExceeded",
  "capacityOverflow",
  "withdrawLimitExceeded",
  "withdrawAmountStaked",
  "eixstingWithdraw",
  "minNotReached",
];
