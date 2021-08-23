const ActionTypeList = ["deposit", "withdraw", "transfer", "migrate"] as const;
export type ActionType = typeof ActionTypeList[number];
export const ACTIONS: { [type in ActionType]: ActionType } = {
  deposit: "deposit",
  withdraw: "withdraw",
  transfer: "transfer",
  migrate: "migrate",
} as const;

export interface ActionModalContentProps {
  onChangeStep: (StepData: StepData) => void;
}

export type ActionModalContent = React.FC<ActionModalContentProps>;

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

export interface StepData {
  title: string;
  stepNum: Steps;
}
