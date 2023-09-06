import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { defaultInterestData, InterestData } from "../models/interestRateModel";
import { getInterestRateModelContract } from "./useInterestRateModelContract";
import { useWeb3Context } from "./web3Context";

export const useInterestRateModelData = () => {
  const { provider } = useWeb3React();
  const { provider: defaultProvider } = useWeb3Context();
  const [data, setData] = useState<InterestData>(defaultInterestData);
  const [loading, setLoading] = useState<boolean>(true);
  const getData = useCallback(async () => {
    const contract = getInterestRateModelContract(provider || defaultProvider);

    if (!contract) {
      return;
    }

    const promises: Promise<BigNumber>[] = [
      contract.kink(),
      contract.kinkRate(),
      contract.zeroRate(),
      contract.fullRate(),
    ];

    const [kink, kinkRate, zeroRate, fullRate] = await Promise.all(
      // Default to 0 when error
      promises.map((p) =>
        p.catch((e) => {
          return BigNumber.from(0);
        })
      )
    );
    setData({
      kink,
      kinkRate,
      zeroRate,
      fullRate,
    } as InterestData);

    setLoading(false);
  }, [defaultProvider, provider]);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    loading,
    data,
  };
};

export default getInterestRateModelContract;
