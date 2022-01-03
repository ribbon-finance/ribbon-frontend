import { useContext } from "react";
import { BigNumber } from "ethers";

import { isEthNetwork, RibbonTokenAddress, VaultVersion } from "../constants/constants";
import {
  ERC20TokenAccountSubgraphData,
  ERC20TokenSubgraphData,
} from "../models/token";
import { SubgraphDataContext } from "./subgraphDataContext";

export const rbnTokenGraphql = (
  account: string | null | undefined,
  vaultVersion: VaultVersion,
  chainId: number,
) => {
  /**
   * RBN Token graphql is only indexed in V1 subgraph
   */
  if (vaultVersion !== "v1" || !isEthNetwork(chainId)) {
    return "";
  }

  return account
    ? `
        erc20TokenAccount(id:"${RibbonTokenAddress.toLowerCase()}-${account.toLocaleLowerCase()}") {
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
        erc20Token(id:"${RibbonTokenAddress.toLowerCase()}") {
          name
          symbol
          numHolders
          holders
          totalSupply
        }
      `;
};

/**
 * Remark: We fetch rbn token subgraph in v1 on subgraph
 */
export const resolveRBNTokenSubgraphResponse = (
  responses: { [vault in VaultVersion]: any | undefined }
): ERC20TokenSubgraphData | undefined => {
  /**
   * Check if we fetch erc20TokenAccount
   */
  if (responses?.v1.erc20TokenAccount) {
    return {
      ...responses.v1.erc20TokenAccount.token,
      totalSupply: BigNumber.from(
        responses.v1.erc20TokenAccount.token.totalSupply
      ),
    };
  }

  /**
   * Else, check if erc20Token is fetched instead
   */
  if (responses?.v1.erc20Token) {
    return {
      ...responses.v1.erc20Token,
      totalSupply: BigNumber.from(responses.v1.erc20Token.totalSupply),
    };
  }

  return undefined;
};

export const resolveRBNTokenAccountSubgraphResponse = (
  responses: { [vault in VaultVersion]: any | undefined }
): ERC20TokenAccountSubgraphData | undefined => {
  if (responses?.v1.erc20TokenAccount) {
    return {
      ...responses.v1.erc20TokenAccount,
      balance: BigNumber.from(responses.v1.erc20TokenAccount.balance),
      token: {
        ...responses.v1.erc20TokenAccount.token,
        totalSupply: BigNumber.from(
          responses.v1.erc20TokenAccount.token.totalSupply
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
    data: contextData.rbnTokenAccount,
    loading: contextData.loading,
  };
};
