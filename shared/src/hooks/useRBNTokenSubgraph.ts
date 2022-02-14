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
  response: any | undefined
): ERC20TokenSubgraphData | undefined => {
  return {
    ...response.rbntoken,
    totalSupply: BigNumber.from(response.rbntoken.totalSupply),
  };
};

export const resolveRBNTokenAccountSubgraphResponse = (
  response: any | undefined
): RBNTokenAccountSubgraphData | undefined => {
  if (response?.rbnaccount) {
    return {
      token: {
        ...response.rbntoken,
      },
      ...response.rbnaccount,
      totalBalance: BigNumber.from(response.rbnaccount.totalBalance),
      lockedBalance: BigNumber.from(response.rbnaccount.lockedBalance),
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
