import { useContext } from "react";
import { BigNumber } from "ethers";

import { RibbonTokenAddress } from "../constants/constants";
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
