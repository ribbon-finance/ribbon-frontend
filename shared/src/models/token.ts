import { BigNumber } from "@ethersproject/bignumber";

export interface ERC20TokenSubgraphData {
  name: string;
  symbol: string;
  numHolders: number;
  holders: string[];
  totalSupply: BigNumber;
}

export interface ERC20TokenAccountSubgraphData {
  id: string;
  token: ERC20TokenSubgraphData;
  balance: BigNumber;
  account: string;
}
