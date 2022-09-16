import Airtable from "airtable";
import dotenv from "dotenv";
import { useEffect, useMemo, useState } from "react";
import useAssetPrice from "./useAssetPrice";
import { useVaultsData } from "./web3DataContext";

const BASE_NAME = "Earn";

const base = Airtable.base("appkUHzxJ1lehQTIt");

export const useAirtable = () => {
  const [apr, setAPR] = useState<number>();
  const [, setError] = useState<string>();

  const { price: RBNPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "RBN",
  });

  const vaultDatas = useVaultsData();

  // useEffect(() => {
  //   // 1. When init load schedules
  //   base(BASE_NAME)
  //     .select({ view: "Grid view" })
  //     .all()
  //     .then((records) => {
  //       // check for undefined rows in airtable

  //       const apr = 
  //       if (!assetPriceLoading) {
  //         setValues(item);
  //       }
  //     })
  //     .catch((e) => {
  //       setError("ERROR FETCHING");
  //     });
  // }, [assetPriceLoading]);

  // const loading = useMemo(() => {
  //   return assetPriceLoading || !values;
  // }, [assetPriceLoading, values]);

  // //   Absolute perf = abs(spot - strike) / strike
  // // (Absolute perf * participation rate * 4 + 1)^(365/28) -1
  // const [absolutePerformance, performance, expectedYield, maxYield] =
  //   useMemo(() => {
  //     if (!values) {
  //       return [0, 0, 0, 0];
  //     }
  //     const absolutePerformance =
  //       Math.abs(ETHPrice - values.strikePrice) / values.strikePrice;

  //     const performance = (ETHPrice - values.strikePrice) / values.strikePrice;

  //     const calculateMaxYield =
  //       values.baseYield +
  //       (values.barrierPercentage * values.participationRate * 4 + 1) **
  //         (365 / 28) -
  //       1;

  //     const calculateExpectedYield =
  //       absolutePerformance > values.barrierPercentage
  //         ? values.baseYield
  //         : values.baseYield +
  //           (absolutePerformance * values.participationRate * 4 + 1) **
  //             (365 / 28) -
  //           1;
  //     return [
  //       absolutePerformance,
  //       performance,
  //       calculateExpectedYield,
  //       calculateMaxYield,
  //     ];
  //   }, [values, ETHPrice]);

  // if (loading || !values) {
  //   //placeholder values while values are loading
  //   return {
  //     loading,
  //     strikePrice: ETHPrice,
  //     baseYield: 0.04,
  //     participationRate: 0.04,
  //     barrierPercentage: 0.08,
  //     absolutePerformance: 0.0,
  //     performance: 0.0,
  //     expectedYield: 0.0,
  //     maxYield: 0.1633,
  //     borrowRate: 0.1,
  //   };
  // }
  // return {
  //   loading,
  //   strikePrice: values.strikePrice,
  //   baseYield: values.baseYield,
  //   participationRate: values.participationRate,
  //   barrierPercentage: values.barrierPercentage,
  //   absolutePerformance: absolutePerformance,
  //   performance: performance,
  //   expectedYield: expectedYield,
  //   maxYield: maxYield,
  //   borrowRate: values.borrowRate,
  // };
};