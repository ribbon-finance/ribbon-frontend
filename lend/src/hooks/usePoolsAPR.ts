import { useEffect, useMemo, useState } from "react";
import { VaultOptions } from "../constants/constants";
import useAssetPrice from "./useAssetPrice";
import { useVaultsData } from "./web3DataContext";
import { VaultList } from "../constants/constants";
import { formatUnits } from "ethers/lib/utils";

export type APRMap = {
  [vault in VaultOptions]: number;
};

export type useDefault = {
  [vault in VaultOptions]: boolean;
};

export const usePoolsAPR = () => {
  const [aprs, setAprs] = useState<APRMap>();
  const [supplyAprs, setSupplyAprs] = useState<APRMap>();
  const [rbnAprs, setRbnAprs] = useState<APRMap>();
  const { loading, data: vaultDatas } = useVaultsData();
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });

  useEffect(() => {
    //if set to true, use default apr instead of calculated apr
    let isDefault: useDefault = {
      wintermute: true,
      folkvang: true,
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

    if (!loading && !assetPriceLoading) {
      VaultList.forEach((pool) => {
        const poolData = vaultDatas[pool];
        const supplyRate = parseFloat(formatUnits(poolData.supplyRate, 18));
        const rewardPerSecond = parseFloat(
          formatUnits(poolData.rewardPerSecond, 18)
        );
        const poolSize = parseFloat(formatUnits(poolData.poolSize, 6));
        aprsTemp[pool] = isDefault[pool]
          ? 7 + ((rewardPerSecond * RBNPrice * 31536000) / poolSize) * 100
          : (supplyRate * 31536000 +
              (rewardPerSecond * RBNPrice * 31536000) / poolSize) *
            100;
        supplyAprsTemp[pool] = isDefault[pool] ? 7 : supplyRate / 100;
        rbnAprsTemp[pool] =
          ((rewardPerSecond * RBNPrice * 31536000) / poolSize) * 100;
        return;
      });
      setAprs(aprsTemp);
      setSupplyAprs(supplyAprsTemp);
      setRbnAprs(rbnAprsTemp);
    }
  }, [loading, assetPriceLoading, RBNPrice, vaultDatas]);

  const isLoading = useMemo(() => {
    return loading || assetPriceLoading || !aprs;
  }, [loading, assetPriceLoading, aprs]);

  if (isLoading || !aprs || !supplyAprs || !rbnAprs) {
    //placeholder values while values are loading
    return {
      loading: isLoading,
      aprs: {
        wintermute: 7,
        folkvang: 7,
      },
      supplyAprs: {
        wintermute: 7,
        folkvang: 7,
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
