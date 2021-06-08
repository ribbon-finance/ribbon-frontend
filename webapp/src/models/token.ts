import { BigNumber } from "@ethersproject/bignumber";

export interface ERC20TokenSubgraphData {
  name: string;
  symbol: string;
  numHolders: number;
  holders: string[];
  totalSupply: BigNumber;
}
