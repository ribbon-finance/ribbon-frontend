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
