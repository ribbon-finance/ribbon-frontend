import { BigNumber } from "@ethersproject/bignumber";

import { VaultList, VaultOptions } from "../constants/constants";

export interface LiquidityMiningPoolResponse {
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

export type LiquidityMiningPoolResponses = {
  [vault in VaultOptions]: LiquidityMiningPoolResponse;
};

export type LiquidityMiningPoolData = {
  responses: LiquidityMiningPoolResponses;
  loading: boolean;
};

export const defaultLiquidityMiningPoolData: LiquidityMiningPoolData = {
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
  ) as LiquidityMiningPoolResponses,
  loading: true,
};

export interface LiquidityGaugeV5PoolResponse {
  currentStake: BigNumber;
  poolSize: BigNumber;
  workingBalances: BigNumber;
  workingSupply: BigNumber;
  claimableRbn: BigNumber;
  unstakedBalance: BigNumber;
  claimedRbn: BigNumber;
  poolRewardForDuration: BigNumber;
  periodEndTime: number;

  // Block timestamp of the last time integrate_checkpoint was called
  integrateCheckpointOf: BigNumber;
}

export type LiquidityGaugeV5PoolResponses = Partial<{
  [vault in VaultOptions]: LiquidityGaugeV5PoolResponse;
}>;

export type LiquidityGaugeV5PoolData = {
  responses: LiquidityGaugeV5PoolResponses;
  loading: boolean;
};

export const defaultLiquidityGaugeV5PoolData: LiquidityGaugeV5PoolData = {
  responses: {},
  loading: true,
};

export interface LiquidityMiningPool {
  id: string;
  numDepositors: number;
  depositors: string[];
  totalSupply: BigNumber;
  totalRewardClaimed: BigNumber;
}

export interface LiquidityMiningPoolAccount {
  id: string;
  pool: LiquidityMiningPool;
  account: string;
  totalRewardClaimed: BigNumber;
  totalBalance: BigNumber;
}

export type LiquidityMiningPoolsSubgraphData = Partial<{
  [vault in VaultOptions]: LiquidityMiningPool;
}>;

export interface StakingPoolsSubgraphData {
  lm: LiquidityMiningPoolsSubgraphData;
}

export const defaultStakingSubgraphData: StakingPoolsSubgraphData = { lm: {} };

export type LiquidityMiningPoolAccountsData = Partial<{
  [vault in VaultOptions]: LiquidityMiningPoolAccount;
}>;
export interface StakingPoolAccountsData {
  lm: LiquidityMiningPoolAccountsData;
}

export const defaultStakingAccountsData: StakingPoolAccountsData = { lm: {} };
