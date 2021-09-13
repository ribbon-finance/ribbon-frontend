const ActionTypeList = ["deposit", "withdraw", "transfer", "migrate"] as const;
export type ActionType = typeof ActionTypeList[number];
export const ACTIONS: { [type in ActionType]: ActionType } = {
  deposit: "deposit",
  withdraw: "withdraw",
  transfer: "transfer",
  migrate: "migrate",
} as const;

export const V2WithdrawOptionList = ["standard", "instant"] as const;

export type V2WithdrawOption = typeof V2WithdrawOptionList[number] | "complete";

export interface ActionModalContentProps {
  onChangeStep: (StepData: StepData) => void;
}

export type ActionModalContent = React.FC<ActionModalContentProps>;

/**
 * Steps
 */
type WarningStep = -1;
type FormStepType = 0;
type PreviewStepType = 1;
type ConfirmationStepType = 2;
type SubmittedStepType = 3;
export type Steps =
  | WarningStep
  | FormStepType
  | PreviewStepType
  | ConfirmationStepType
  | SubmittedStepType;

export const STEPS: {
  warningStep: WarningStep;
  formStep: FormStepType;
  previewStep: PreviewStepType;
  confirmationStep: ConfirmationStepType;
  submittedStep: SubmittedStepType;
} = {
  warningStep: -1,
  formStep: 0,
  previewStep: 1,
  confirmationStep: 2,
  submittedStep: 3,
};

export interface StepData {
  title: string;
  stepNum: Steps;
}
