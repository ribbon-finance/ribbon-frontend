import { useMemo } from "react";
import { PoolList } from "../constants/constants";
import useAssetPrice from "./useAssetPrice";
import { formatUnits } from "ethers/lib/utils";
import { useFetchPoolData } from "./useFetchPoolData";

const secondsInYear = 31536000;

export const useLendAPY = () => {
  const { loading, data } = useFetchPoolData();

  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });

  const poolsAvgAPY = useMemo(() => {
    let cumulativeAPY = 0;
    if (!loading) {
      PoolList.forEach((pool) => {
        const poolData = data[pool];
        const poolSize = parseFloat(formatUnits(poolData.poolSize, 6));
        const rewardPerSecond = parseFloat(
          formatUnits(poolData.rewardPerSecond, 18)
        );
        cumulativeAPY +=
          ((rewardPerSecond * RBNPrice * secondsInYear) / poolSize) * 100;
      });
    }
    return cumulativeAPY / PoolList.length;
  }, [loading, data, RBNPrice]);

  const isLoading = useMemo(() => {
    return loading || assetPriceLoading;
  }, [loading, assetPriceLoading]);

  return {
    loading: isLoading,
    poolsAvgAPY,
  };
};
