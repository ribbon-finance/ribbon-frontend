import { useEffect, useMemo, useState } from "react";
import { secondsPerYear } from "../constants/constants";
import { PoolOptions, PoolList } from "shared/lib/constants/lendConstants";
import useAssetPrice from "./useAssetPrice";
import { usePoolsData } from "./web3DataContext";
import { formatUnits } from "ethers/lib/utils";

export type AprMap = {
  [pool in PoolOptions]: number;
};

export type UseDefault = {
  [pool in PoolOptions]: boolean;
};

const defaultApr = 7;

export const usePoolsApr = () => {
  const [aprs, setAprs] = useState<AprMap>();
  const [supplyAprs, setSupplyAprs] = useState<AprMap>();
  const [rbnAprs, setRbnAprs] = useState<AprMap>();
  const { loading, data: poolDatas } = usePoolsData();
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });

  useEffect(() => {
    //if set to true, use default apr instead of calculated apr
    let isDefault: UseDefault = {
      wintermute: false,
      folkvang: false,
    };

    // 1. When init load schedules
    let aprsTemp: AprMap = {
      wintermute: 0,
      folkvang: 0,
    };

    let supplyAprsTemp: AprMap = {
      wintermute: 0,
      folkvang: 0,
    };

    let rbnAprsTemp: AprMap = {
      wintermute: 0,
      folkvang: 0,
    };

    if (!loading) {
      PoolList.forEach((pool) => {
        const poolData = poolDatas[pool];
        const supplyRate = parseFloat(formatUnits(poolData.supplyRate, 18));
        const rewardPerSecond = parseFloat(
          formatUnits(poolData.rewardPerSecond, 18)
        );
        const poolSize = parseFloat(formatUnits(poolData.poolSize, 6));
        const supplyRatePercentage = supplyRate * secondsPerYear;
        const rbnApr = (rewardPerSecond * RBNPrice * secondsPerYear) / poolSize;
        aprsTemp[pool] = isDefault[pool]
          ? defaultApr + rbnApr * 100
          : (supplyRatePercentage + rbnApr) * 100;
        supplyAprsTemp[pool] = isDefault[pool]
          ? defaultApr
          : supplyRatePercentage * 100;
        rbnAprsTemp[pool] = rbnApr * 100;
        return;
      });
      setAprs(aprsTemp);
      setSupplyAprs(supplyAprsTemp);
      setRbnAprs(rbnAprsTemp);
    }
  }, [loading, assetPriceLoading, RBNPrice, poolDatas]);

  const isLoading = useMemo(() => {
    return loading || !aprs || assetPriceLoading;
  }, [loading, aprs, assetPriceLoading]);

  if (isLoading || !aprs || !supplyAprs || !rbnAprs) {
    //placeholder values while values are loading
    return {
      loading: isLoading,
      aprs: {
        wintermute: defaultApr,
        folkvang: defaultApr,
      },
      supplyAprs: {
        wintermute: defaultApr,
        folkvang: defaultApr,
      },
      rbnAprs: {
        wintermute: 0,
        folkvang: 0,
      },
    };
  }
  return {
    loading: isLoading,
    rbnAprLoading: !rbnAprs || assetPriceLoading,
    aprs: aprs,
    supplyAprs: supplyAprs,
    rbnAprs: rbnAprs,
  };
};
