import { useContext } from "react";
import { BigNumber } from "ethers";

import {
  isEthNetwork,
  RibbonTokenAddress,
  SubgraphVersion,
} from "../constants/constants";
import {
  ERC20TokenSubgraphData,
  RBNTokenAccountSubgraphData,
} from "../models/token";
import { SubgraphDataContext } from "./subgraphDataContext";

export const rbnTokenGraphql = (
  account: string | null | undefined,
  version: SubgraphVersion,
  chainId: number
) => {
  switch (version) {
    case "v1":
      if (isEthNetwork(chainId)) {
        return account
          ? `
              rbnTokenAccount: erc20TokenAccount(id:"${RibbonTokenAddress.toLowerCase()}-${account.toLocaleLowerCase()}") {
                token {
                  name
                  symbol
                  numHolders
                  holders
                  totalSupply
                }
                balance
                account
              }
            `
          : `
              rbnToken: erc20Token(id:"${RibbonTokenAddress.toLowerCase()}") {
                name
                symbol
                numHolders
                holders
                totalSupply
              }
            `;
      }
      return "";
    case "governance":
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
    default:
      return "";
  }
};

/**
 * Remark: We fetch rbn token subgraph in v1 on subgraph
 */
export const resolveRBNTokenSubgraphResponse = (
  responses: { [version in SubgraphVersion]: any | undefined }
): ERC20TokenSubgraphData | undefined => {
  /**
   * We prioritize data source from governance subgraph
   * */
  if (responses?.governance.rbnaccount) {
    return {
      ...responses.governance.rbnaccount.token,
      totalSupply: BigNumber.from(
        responses.governance.rbnaccount.token.totalSupply
      ),
    };
  }

  if (responses?.governance.rbntoken) {
    return {
      ...responses.governance.rbntoken,
      totalSupply: BigNumber.from(responses.governance.rbntoken.totalSupply),
    };
  }

  /**
   * @deprecated
   * Secondary data soruce from V1 subgraph, phasing out so we can maintain only 1 subgraph
   */
  if (responses?.v1.rbnTokenAccount) {
    return {
      ...responses.v1.rbnTokenAccount.token,
      totalSupply: BigNumber.from(
        responses.v1.rbnTokenAccount.token.totalSupply
      ),
    };
  }

  if (responses?.v1.rbnToken) {
    return {
      ...responses.v1.rbnToken,
      totalSupply: BigNumber.from(responses.v1.rbnToken.totalSupply),
    };
  }

  return undefined;
};

export const resolveRBNTokenAccountSubgraphResponse = (
  responses: { [version in SubgraphVersion]: any | undefined }
): RBNTokenAccountSubgraphData | undefined => {
  if (responses?.governance.rbnaccount) {
    return {
      ...responses.governance.rbnaccount,
      totalBalance: BigNumber.from(
        responses.governance.rbnaccount.totalBalance
      ),
      lockedBalance: BigNumber.from(
        responses.governance.rbnaccount.lockedBalance
      ),
    };
  }

  /**
   * @deprecated
   */
  if (responses?.v1.rbnTokenAccount) {
    return {
      ...responses.v1.rbnTokenAccount,
      totalBalance: BigNumber.from(responses.v1.rbnTokenAccount.balance),
      lockedBalance: BigNumber.from(0),
      token: {
        ...responses.v1.rbnTokenAccount.token,
        totalSupply: BigNumber.from(
          responses.v1.rbnTokenAccount.token.totalSupply
        ),
      },
    };
  }

  return undefined;
};

export const useRBNToken = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    data: contextData.rbnToken,
    loading: contextData.loading,
  };
};

export const useRBNTokenAccount = () => {
  const contextData = useContext(SubgraphDataContext);

  return {
    data: contextData.rbnTokenAccount
      ? {
          ...contextData.rbnTokenAccount,
          walletBalance: contextData.rbnTokenAccount.totalBalance.sub(
            contextData.rbnTokenAccount.lockedBalance
          ),
        }
      : undefined,
    loading: contextData.loading,
  };
};
