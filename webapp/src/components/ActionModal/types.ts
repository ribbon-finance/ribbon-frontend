export const ACTIONS: { deposit: DepositAction; withdraw: WithdrawAction } = {
  deposit: "deposit",
  withdraw: "withdraw",
};

export type DepositAction = "deposit";
export type WithdrawAction = "withdraw";

export type ActionType = DepositAction | WithdrawAction;

export type DepositParams = {
  action: DepositAction;
  yield: number;
};
export type WithdrawParams = {
  action: WithdrawAction;
  withdrawalFee: number;
};
export type ActionParams = DepositParams | WithdrawParams;

export interface ActionModalContentProps {
  onChangeStep: (StepData: StepData) => void;
}

export type ActionModalContent = React.FC<ActionModalContentProps>;

/**
 * Steps
 */

type PreviewStepType = 0;
type ConfirmationStepType = 1;
type SubmittedStepType = 2;
export type Steps = PreviewStepType | ConfirmationStepType | SubmittedStepType;

export const STEPS: {
  previewStep: PreviewStepType;
  confirmationStep: ConfirmationStepType;
  submittedStep: SubmittedStepType;
} = {
  previewStep: 0,
  confirmationStep: 1,
  submittedStep: 2,
};

export type MobileNavigationButtonTypes = "back" | "close";

export interface StepData {
  title: string;
  stepNum: Steps;
  navigationButton: MobileNavigationButtonTypes;
}
