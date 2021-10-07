import { BigNumber } from "@ethersproject/bignumber";

import { VaultList, VaultOptions } from "../constants/constants";

export interface StakingPoolResponse {
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

export type StakingPoolResponses = {
  [vault in VaultOptions]: StakingPoolResponse;
};

export type StakingPoolData = {
  responses: StakingPoolResponses;
  loading: boolean;
};

export const defaultStakingPoolData: StakingPoolData = {
  responses: Object.fromEntries(
    VaultList.map((vault) => [
      vault as VaultOptions,
      {
        currentStake: BigNumber.from(0),
        poolSize: BigNumber.from(0),
        poolRewardForDuration: BigNumber.from(0),
        claimHistory: [] as Array<{ amount: BigNumber }>,
        claimableRbn: BigNumber.from(0),
        unstakedBalance: BigNumber.from(0),
      },
    ])
  ) as StakingPoolResponses,
  loading: true,
};

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
