export const ACTIONS: { deposit: DepositAction; withdraw: WithdrawAction } = {
  deposit: "deposit",
  withdraw: "withdraw",
};

export type DepositAction = "deposit";
export type WithdrawAction = "withdraw";

export type ActionType = DepositAction | WithdrawAction;
