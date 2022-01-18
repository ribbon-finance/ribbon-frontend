import { BigNumber } from "@ethersproject/bignumber";

export interface ERC20TokenSubgraphData {
  name: string;
  symbol: string;
  numHolders: number;
  holders: string[];
  totalSupply: BigNumber;
}

export interface IERC20TokenAccountSubgraphData {
  id: string;
  token: ERC20TokenSubgraphData;
}

export interface ERC20TokenAccountSubgraphData
  extends IERC20TokenAccountSubgraphData {
  balance: BigNumber;
  account: string;
}

export interface RBNTokenAccountSubgraphData
  extends IERC20TokenAccountSubgraphData {
  totalBalance: BigNumber;
  lockedBalance: BigNumber;
  lockStartTimestamp?: number;
  lockEndTimestamp?: number;
}
