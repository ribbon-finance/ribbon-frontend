import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  DefiScoreToken,
  DefiScoreTokenList,
  DefiScoreOpportunitiesResponse,
} from "../models/defiScore";
import { Assets } from "../store/types";
import { isProduction } from "../utils/env";
import {
  AssetsYieldInfoData,
  defaultAssetsYieldData,
  ExternalAPIDataContext,
} from "./externalAPIDataContext";

export const useFetchAssetsYield = () => {
  const [data, setData] = useState(defaultAssetsYieldData);
  const [loading, setLoading] = useState(true);

  const fetchAssetsYield = useCallback(async () => {
    if (!isProduction()) {
      console.time("Asset Yield Data Fetch");
    }

    const response = await axios.get<DefiScoreOpportunitiesResponse>(
      `https://api.defiscore.io/earn/opportunities`
    );

    const yieldInfoObj = Object.fromEntries(
      DefiScoreTokenList.map((token) => [token, new Array(0)])
    ) as AssetsYieldInfoData;

    for (let i = 0; i < response.data.data.length; i++) {
      const curr = response.data.data[i];

      yieldInfoObj[curr.token].push({
        protocol: curr.protocol,
        apr: parseFloat(curr.aprHistory[curr.aprHistory.length - 1].value),
      });
    }

    setData(
      Object.fromEntries(
        Object.keys(yieldInfoObj).map((token) => [
          token,
          yieldInfoObj[token as DefiScoreToken].sort((a, b) =>
            a.apr < b.apr ? 1 : -1
          ),
        ])
      ) as AssetsYieldInfoData
    );
    setLoading(false);

    if (!isProduction()) {
      console.timeEnd("Asset Yield Data Fetch");
    }
  }, []);

  useEffect(() => {
    fetchAssetsYield();
  }, [fetchAssetsYield]);

  return { data, loading };
};

const useAssetsYield = (asset: Assets) => {
  const contextData = useContext(ExternalAPIDataContext);

  let baseAsset =
    asset === "WETH" ? "eth" : (asset.toLowerCase() as DefiScoreToken);

  switch (asset) {
    case "yvUSDC":
      baseAsset = "usdc";
      break;
    case "stETH":
      baseAsset = "eth";
  }

  return contextData.assetsYield.data[baseAsset];
};

export default useAssetsYield;
