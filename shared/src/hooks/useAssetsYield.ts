import axios from "axios";
import { useEffect } from "react";
import {
  DefiScoreToken,
  DefiScoreTokenList,
  DefiScoreOpportunitiesResponse,
  DefiScoreProtocol,
} from "../models/defiScore";
import { useGlobalState } from "../store/store";
import { Assets, AssetYieldsInfoData } from "../store/types";

const useAssetsYield = (asset: Assets) => {
  const [assetYieldsInfo, setAssetYieldsInfo] = useGlobalState(
    "assetYieldsInfo"
  );

  useEffect(() => {
    if (assetYieldsInfo.fetched) {
      return;
    }

    (async () => {
      const data = await fetchAssetsYield();

      const yieldInfoObj: AssetYieldsInfoData = Object.fromEntries(
        DefiScoreTokenList.map((token) => [token, new Array(0)])
      ) as AssetYieldsInfoData;

      for (let i = 0; i < data.length; i++) {
        const curr = data[i];

        yieldInfoObj[curr.token].push({
          protocol: curr.protocol,
          apr: parseFloat(curr.apr),
        });
      }

      setAssetYieldsInfo({
        fetched: true,
        data: Object.fromEntries(
          Object.keys(yieldInfoObj).map((token) => [
            token,
            yieldInfoObj[token as DefiScoreToken].sort((a, b) =>
              a.apr < b.apr ? 1 : -1
            ),
          ])
        ) as AssetYieldsInfoData,
      });
    })();
  }, []);

  return assetYieldsInfo.data[
    asset === "WETH" ? "eth" : (asset.toLowerCase() as DefiScoreToken)
  ];
};

export default useAssetsYield;

const fetchAssetsYield = async () => {
  const response = await axios.get<DefiScoreOpportunitiesResponse>(
    `https://api.defiscore.io/earn/opportunities`
  );

  return response.data.data;
};
