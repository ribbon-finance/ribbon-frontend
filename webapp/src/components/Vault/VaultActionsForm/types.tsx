import { VaultOptions } from "shared/lib/constants/constants";

export interface FormStepProps {
  vaultOption: VaultOptions;
  onFormSubmit: () => void;
}

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
] as const;

export type VaultValidationErrors = typeof VaultValidationErrorList[number];

export const VaultInputValidationErrorList: Array<VaultValidationErrors> = [
  "insufficientBalance",
  "maxExceeded",
  "capacityOverflow",
  "withdrawLimitExceeded",
  "withdrawAmountStaked",
  "eixstingWithdraw",
];
