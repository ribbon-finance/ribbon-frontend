import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { RibbonTokenAddress } from "shared/lib/constants/constants";

import { getSubgraphqlURI } from "shared/lib/utils/env";
import { ERC20TokenAccountSubgraphData } from "../models/token";
import { impersonateAddress } from "shared/lib/utils/development";

const useRBNTokenAccount = () => {
  const web3Context = useWeb3React();
  const account = impersonateAddress ? impersonateAddress : web3Context.account;
  const [data, setData] = useState<ERC20TokenAccountSubgraphData>();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (acc: string) => {
    setLoading(true);

    setData(await fetchTokenSubgraph(acc));

    setLoading(false);
  }, []);

  useEffect(() => {
    if (account) {
      loadData(account);
    }
  }, [account, loadData]);

  return { data, loading };
};

const fetchTokenSubgraph = async (
  account: string
): Promise<ERC20TokenAccountSubgraphData | undefined> => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          erc20TokenAccount(id:"${RibbonTokenAddress.toLowerCase()}-${account.toLocaleLowerCase()}") {
            token {
              name
              symbol
              numHolders
              holders
              tokenAccounts
              totalSupply
            }
            balance
            account
          }
        }
        `,
  });

  return response.data.data.erc20TokenAccount
    ? {
        ...response.data.data.erc20TokenAccount,
        balance: BigNumber.from(response.data.data.erc20TokenAccount.balance),
        token: {
          ...response.data.data.erc20TokenAccount.token,
          totalSupply: BigNumber.from(
            response.data.data.erc20TokenAccount.token.totalSupply
          ),
        },
      }
    : undefined;
};

export default useRBNTokenAccount;
