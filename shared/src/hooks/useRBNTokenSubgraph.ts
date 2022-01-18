import { useContext } from "react";
import { BigNumber } from "ethers";

import { RibbonTokenAddress } from "../constants/constants";
import {
  ERC20TokenSubgraphData,
  RBNTokenAccountSubgraphData,
} from "../models/token";
import { SubgraphDataContext } from "./subgraphDataContext";

export const rbnTokenGraphql = (account: string | null | undefined) => {
  return account
    ? `
        rbnaccount(id:"${account.toLocaleLowerCase()}") {
          token {
            name
            symbol
            numHolders
            holders
            totalSupply
          }
          totalBalance
          lockedBalance
          lockStartTimestamp
          lockEndTimestamp
        }
      `
    : `
        rbntoken(id:"${RibbonTokenAddress.toLowerCase()}") {
          name
          symbol
          numHolders
          holders
          totalSupply
        }
      `;
};

export const resolveRBNTokenSubgraphResponse = (
  response: any | undefined
): ERC20TokenSubgraphData | undefined => {
  /**
   * We prioritize data source from governance subgraph
   * */
  if (response?.rbnaccount) {
    return {
      ...response.rbnaccount.token,
      totalSupply: BigNumber.from(response.rbnaccount.token.totalSupply),
    };
  }

  if (response?.rbntoken) {
    return {
      ...response.rbntoken,
      totalSupply: BigNumber.from(response.rbntoken.totalSupply),
    };
  }

  return undefined;
};

export const resolveRBNTokenAccountSubgraphResponse = (
  response: any | undefined
): RBNTokenAccountSubgraphData | undefined => {
  if (response?.rbnaccount) {
    return {
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
