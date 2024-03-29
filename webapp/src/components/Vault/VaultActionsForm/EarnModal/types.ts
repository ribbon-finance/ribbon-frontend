const ActionTypeList = ["deposit", "withdraw"] as const;
export type ActionType = typeof ActionTypeList[number];
export const ACTIONS: { [type in ActionType]: ActionType } = {
  deposit: "deposit",
  withdraw: "withdraw",
} as const;

export const V2WithdrawOptionList = ["standard", "instant"] as const;

export type V2WithdrawOption = typeof V2WithdrawOptionList[number] | "complete";

/**
 * Steps
 */
type FormStepType = 0;
type PreviewStepType = 1;
type ConfirmationStepType = 2;
type SubmittedStepType = 3;
export type Steps =
  | FormStepType
  | PreviewStepType
  | ConfirmationStepType
  | SubmittedStepType;

export const STEPS: {
  formStep: FormStepType;
  previewStep: PreviewStepType;
  confirmationStep: ConfirmationStepType;
  submittedStep: SubmittedStepType;
} = {
  formStep: 0,
  previewStep: 1,
  confirmationStep: 2,
  submittedStep: 3,
};
