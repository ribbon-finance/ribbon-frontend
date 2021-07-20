import { BigNumber } from "@ethersproject/bignumber";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { RibbonTokenAddress } from "../constants/constants";
import { ERC20TokenSubgraphData } from "../models/token";
import { getSubgraphqlURI } from "../utils/env";

const useRBNToken = () => {
  // TODO: Global state
  const [data, setData] = useState<ERC20TokenSubgraphData>();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    setData(await fetchTokenSubgraph());

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading };
};

const fetchTokenSubgraph = async (): Promise<ERC20TokenSubgraphData> => {
  const response = await axios.post(getSubgraphqlURI(), {
    query: `
        {
          erc20Token(id:"${RibbonTokenAddress.toLowerCase()}") {
              name
              symbol
              numHolders
              holders
              tokenAccounts
              totalSupply
          }
        }
        `,
  });

  return {
    ...response.data.data.erc20Token,
    totalSupply: BigNumber.from(response.data.data.erc20Token.totalSupply),
  };
};

export default useRBNToken;
