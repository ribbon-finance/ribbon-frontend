import { useEffect, useMemo, useState } from "react";
import { VaultOptions } from "../constants/constants";
import useAssetPrice from "./useAssetPrice";
import { useVaultsData } from "./web3DataContext";
import { VaultList } from "../constants/constants";
import { formatUnits } from "ethers/lib/utils";

export type APRMap = {
  [vault in VaultOptions]: number;
};

export const usePoolsAPR = () => {
  const [aprs, setAPRs] = useState<APRMap>();
  const { loading, data: vaultDatas } = useVaultsData();
  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });

  useEffect(() => {
    // 1. When init load schedules
    let aprsTemp: APRMap = {
      Alameda: 0,
      JumpTrading: 0,
      Wintermute: 0,
      Orthogonal: 0,
      Folkvang: 0,
    };

    if (!loading && !assetPriceLoading) {
      VaultList.forEach((pool) => {
        const poolData = vaultDatas[pool];
        const supplyRate = parseFloat(formatUnits(poolData.supplyRate, 18));
        const rewardPerSecond = parseFloat(
          formatUnits(poolData.rewardPerSecond, 18)
        );
        const poolSize = parseFloat(formatUnits(poolData.deposits, 6));
        aprsTemp[pool] =
          (supplyRate + (rewardPerSecond * RBNPrice * 31536000) / poolSize) *
          100;
        return;
      });
      setAPRs(aprsTemp);
    }
  }, [loading, assetPriceLoading, RBNPrice, vaultDatas]);

  const isLoading = useMemo(() => {
    return loading || assetPriceLoading || !aprs;
  }, [loading, assetPriceLoading, aprs]);

  if (isLoading || !aprs) {
    //placeholder values while values are loading
    return {
      Alameda: 0,
      JumpTrading: 0,
      Wintermute: 0,
      Orthogonal: 0,
      Folkvang: 0,
    };
  }
  return aprs;
};
