import { BigNumber } from "@ethersproject/bignumber";

export interface ERC20TokenSubgraphData {
  name: string;
  symbol: string;
  numHolders: number;
  holders: string[];
  totalSupply: BigNumber;
  totalStaked?: BigNumber;
}

export interface RBNTokenAccountSubgraphData {
  token: ERC20TokenSubgraphData;
  totalBalance: BigNumber;
  lockedBalance: BigNumber;
  lockStartTimestamp?: number;
  lockEndTimestamp?: number;
}
