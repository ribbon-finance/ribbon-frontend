import { useEffect, useMemo, useState } from "react";
import { PoolOptions } from "../constants/constants";
import useAssetPrice from "./useAssetPrice";
import { usePoolsData } from "./web3DataContext";
import { PoolList } from "../constants/constants";
import { formatUnits } from "ethers/lib/utils";

export type APRMap = {
  [pool in PoolOptions]: number;
};

export type useDefault = {
  [pool in PoolOptions]: boolean;
};

const defaultAPR = 7;
const secondsInYear = 31536000;
export const usePoolsAPR = () => {
  const [aprs, setAprs] = useState<APRMap>();
  const [supplyAprs, setSupplyAprs] = useState<APRMap>();
  const [rbnAprs, setRbnAprs] = useState<APRMap>();
  const { loading, data: poolDatas } = usePoolsData();
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });

  useEffect(() => {
    //if set to true, use default apr instead of calculated apr
    let isDefault: useDefault = {
      wintermute: false,
      folkvang: false,
    };

    // 1. When init load schedules
    let aprsTemp: APRMap = {
      wintermute: 0,
      folkvang: 0,
    };

    let supplyAprsTemp: APRMap = {
      wintermute: 0,
      folkvang: 0,
    };

    let rbnAprsTemp: APRMap = {
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
        const supplyRatePercentage = Math.min(supplyRate * secondsInYear, 0.07);
        aprsTemp[pool] = isDefault[pool]
          ? defaultAPR +
            ((rewardPerSecond * RBNPrice * secondsInYear) / poolSize) * 100
          : (supplyRatePercentage +
              (rewardPerSecond * RBNPrice * secondsInYear) / poolSize) *
            100;
        supplyAprsTemp[pool] = isDefault[pool]
          ? defaultAPR
          : supplyRatePercentage * 100;
        rbnAprsTemp[pool] =
          ((rewardPerSecond * RBNPrice * secondsInYear) / poolSize) * 100;
        return;
      });
      setAprs(aprsTemp);
      setSupplyAprs(supplyAprsTemp);
      setRbnAprs(rbnAprsTemp);
    }
  }, [loading, assetPriceLoading, RBNPrice, poolDatas]);

  const isLoading = useMemo(() => {
    return loading || !aprs;
  }, [loading, aprs]);

  if (isLoading || !aprs || !supplyAprs || !rbnAprs) {
    //placeholder values while values are loading
    return {
      loading: isLoading,
      aprs: {
        wintermute: defaultAPR,
        folkvang: defaultAPR,
      },
      supplyAprs: {
        wintermute: defaultAPR,
        folkvang: defaultAPR,
      },
      rbnAprs: {
        wintermute: 0,
        folkvang: 0,
      },
    };
  }
  return {
    loading: isLoading,
    aprs: aprs,
    supplyAprs: supplyAprs,
    rbnAprs: rbnAprs,
  };
};
