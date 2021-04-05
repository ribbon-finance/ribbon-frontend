import { BigNumber } from "ethers";

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

export interface PreviewStepProps {
  actionType: ActionType;
  amount: BigNumber;
  positionAmount: BigNumber;
  actionParams: ActionParams;
}
