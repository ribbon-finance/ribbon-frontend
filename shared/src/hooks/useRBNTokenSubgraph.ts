import { useContext } from "react";
import { BigNumber } from "ethers";

import {
  RibbonTokenAddress,
  VaultLiquidityMiningMap,
} from "../constants/constants";
import {
  ERC20TokenSubgraphData,
  RBNTokenAccountSubgraphData,
} from "../models/token";
import { SubgraphDataContext } from "./subgraphDataContext";

export interface RBNTokenSubgraphResponse {
  rbntoken: {
    name: string;
    symbol: string;
    numHolders: number;
    holders: string[];
    totalSupply: string;
    totalStaked?: string;
  };
}

export interface RBNTokenAccountSubgraphResponse
  extends RBNTokenSubgraphResponse {
  rbnaccount?: {
    totalBalance: string;
    lockedBalance: string;
    lockStartTimestamp?: string;
    lockEndTimestamp?: string;
  };
}

export const rbnTokenGraphql = (account: string | null | undefined) => `
  rbntoken(id:"${RibbonTokenAddress.toLowerCase()}") {
    name
    symbol
    numHolders
    holders
    totalSupply
    totalStaked
  }
  tokenMinterDistributions(where: { id_in: [
    ${Object.values(VaultLiquidityMiningMap.lg5)
      .map((address) => `"${address.toLowerCase()}"`)
      .join(", ")}
  ]}) {
    id
    amount
  }
  ${
    account
      ? `
      rbnaccount(id:"${account.toLocaleLowerCase()}") {
        totalBalance
        lockedBalance
        lockStartTimestamp
        lockEndTimestamp
      }
    `
      : ""
  }
`;

export const resolveRBNTokenSubgraphResponse = (
  response?: RBNTokenSubgraphResponse
): ERC20TokenSubgraphData | undefined => {
  if (response) {
    const { rbntoken } = response;
    const { totalSupply, totalStaked, ...others } = rbntoken;
    return {
      ...others,
      totalStaked: totalStaked ? BigNumber.from(totalStaked) : undefined,
      totalSupply: BigNumber.from(totalSupply),
    };
  }
  return undefined;
};

export const resolveRBNTokenAccountSubgraphResponse = (
  response?: RBNTokenAccountSubgraphResponse
): RBNTokenAccountSubgraphData | undefined => {
  if (response?.rbnaccount) {
    const { rbnaccount, ...others } = response;
    return {
      ...rbnaccount,
      token: resolveRBNTokenSubgraphResponse(others)!,
      lockStartTimestamp:
        rbnaccount.lockStartTimestamp === undefined
          ? undefined
          : Number(rbnaccount.lockStartTimestamp),
      lockEndTimestamp:
        rbnaccount.lockEndTimestamp === undefined
          ? undefined
          : Number(rbnaccount.lockEndTimestamp),
      totalBalance: BigNumber.from(rbnaccount.totalBalance),
      lockedBalance: BigNumber.from(rbnaccount.lockedBalance),
    };
  }

  return undefined;
};

export const resolveRbnDistributedSubgraphResponse = (
  response: any | undefined
): BigNumber => {
  if (response?.tokenMinterDistributions) {
    const distributionsPerGauge = response.tokenMinterDistributions as {
      id: string;
      amount: string;
    }[];
    return distributionsPerGauge.reduce((prev, dist) => {
      return prev.add(BigNumber.from(dist.amount));
    }, BigNumber.from(0));
  }

  return BigNumber.from(0);
};

export const useRBNToken = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    data: contextData.governanceSubgraphData.rbnToken,
    loading: contextData.governanceSubgraphData.loading,
  };
};

export const useRBNTokenAccount = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    data: contextData.governanceSubgraphData.rbnTokenAccount
      ? {
          ...contextData.governanceSubgraphData.rbnTokenAccount,
          walletBalance:
            contextData.governanceSubgraphData.rbnTokenAccount.totalBalance.sub(
              contextData.governanceSubgraphData.rbnTokenAccount.lockedBalance
            ),
        }
      : undefined,
    loading: contextData.governanceSubgraphData.loading,
  };
};

export const useRbnTokenDistributed = () => {
  const contextData = useContext(SubgraphDataContext);
  return {
    data: contextData.governanceSubgraphData.rbnTokenDistributedLg5,
    loading: contextData.governanceSubgraphData.loading,
  };
};
