import { BigNumber } from "ethers";

export type GovernanceTransactionType =
  | "stake"
  | "unstake"
  | "increaseStakeDuration"
  | "increaseStakeAmount"
  | "gaugeBoosting";

export interface GovernanceTransaction {
  id: string;
  type: GovernanceTransactionType;
  address: string;
  txhash: string;
  timestamp: number;
  amount: BigNumber;
  fee: number;
}
