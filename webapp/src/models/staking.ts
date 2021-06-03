import { BigNumber } from "@ethersproject/bignumber";

export interface StakingPoolData {
  currentStake: BigNumber;
  poolSize: BigNumber;
  expectedYield: number;
  claimableRbn: BigNumber;
  unstakedBalance: BigNumber;
}
