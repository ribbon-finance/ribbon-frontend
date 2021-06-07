import { BigNumber } from "@ethersproject/bignumber";

export interface StakingPoolData {
  currentStake: BigNumber;
  poolSize: BigNumber;
  lastTimeRewardApplicable?: string;
  claimHistory: Array<{
    amount: BigNumber;
  }>;
  expectedYield: number;
  claimableRbn: BigNumber;
  unstakedBalance: BigNumber;
}
