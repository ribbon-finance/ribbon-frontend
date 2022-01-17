import { useContext } from "react";
import { BigNumber } from "ethers";

import { RibbonTokenAddress, SubgraphVersion } from "../constants/constants";
import {
  ERC20TokenSubgraphData,
  RBNTokenAccountSubgraphData,
} from "../models/token";
import { SubgraphDataContext } from "./subgraphDataContext";

export const rbnTokenGraphql = (
  account: string | null | undefined,
  version: SubgraphVersion
) => {
  switch (version) {
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
