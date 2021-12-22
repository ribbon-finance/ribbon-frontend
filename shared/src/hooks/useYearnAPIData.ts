import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";

import { isProduction } from "../utils/env";
import { ExternalAPIDataContext, YearnAPIData } from "./externalAPIDataContext";

export const useFetchYearnAPIData = () => {
  const [data, setData] = useState<YearnAPIData>([]);
  const [loading, setLoading] = useState(true);

  const fetchYearnAPIData = useCallback(async () => {
    if (!isProduction()) {
      console.time("Yearn API Data Fetch");
    }

    const response = await axios.get(
      "https://api.yearn.finance/v1/chains/1/vaults/all"
    );

    setData(
      response.data.map((data: any) => ({
        address: data.address,
        symbol: data.symbol,
        name: data.name,
        token: {
          address: data.token.address,
          decimals: data.token.decimals,
          name: data.token.name,
          symbol: data.token.symbol,
        },
        type: data.type,
        version: data.version,
        apy: {
          grossAPR: data.apy.gross_apr,
          netAPY: data.apy.net_apy,
        },
      }))
    );
    setLoading(false);

    if (!isProduction()) {
      console.timeEnd("Yearn API Data Fetch");
    }
  }, []);

  useEffect(() => {
    fetchYearnAPIData();
  }, [fetchYearnAPIData]);

  return { data, loading };
};

const useYearnAPIData = () => {
  const contextData = useContext(ExternalAPIDataContext);

  const getVaultAPR = useCallback(
    (symbol: string, version: string) => {
      const vault = contextData.yearnAPIData.data.find(
        (data) => data.symbol === symbol && data.version === version
      );
      if (!vault) {
        return 0;
      }

      return vault.apy.netAPY;
    },
    [contextData.yearnAPIData]
  );

  return { getVaultAPR };
};

export default useYearnAPIData;
