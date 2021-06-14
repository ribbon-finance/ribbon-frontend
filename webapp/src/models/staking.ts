import { BigNumber } from "@ethersproject/bignumber";

export interface StakingPoolData {
  currentStake: BigNumber;
  poolSize: BigNumber;
  lastTimeRewardApplicable?: string;
  periodFinish?: string;
  claimHistory: Array<{
    amount: BigNumber;
  }>;
  poolRewardForDuration: BigNumber;
  claimableRbn: BigNumber;
  unstakedBalance: BigNumber;
}

export interface StakingPool {
  id: string;
  numDepositors: number;
  depositors: string[];
  totalSupply: BigNumber;
  totalRewardClaimed: BigNumber;
}

export interface StakingPoolAccount {
  id: string;
  pool: StakingPool;
  account: string;
  totalRewardClaimed: BigNumber;
  totalBalance: BigNumber;
}
