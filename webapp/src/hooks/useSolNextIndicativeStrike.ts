import { get10dStrikeFromDeribit } from "shared/lib/utils/deribitMath";
import { useMemo } from "react";
import useAssetPrice from "shared/lib/hooks/useAssetPrice";
import { useDeribitContext } from "./deribitContext";

const defaultOptions = {
  asset: "SOL",
  delta: 0,
  bidPrice: 0,
  bidPriceInUSD: 0,
  strikePrice: 0,
  bidIV: 0,
  markIV: 0,
  markPrice: 0,
};

// get the next indicative strike for SOL
export const useSolNextIndicativeStrike = (): number => {
  const { price: solPrice, loading: assetPriceLoading } = useAssetPrice({
    asset: "SOL",
  });

  const { options } = useDeribitContext();

  const strikeData = useMemo(() => {
    const spotPrice = solPrice as number;
    if (assetPriceLoading || !Object.keys(options.SOL).length) {
      return defaultOptions;
    }

    try {
      return get10dStrikeFromDeribit(false, spotPrice, 5, options.SOL);
    } catch (err) {
      return defaultOptions;
    }
  }, [solPrice, assetPriceLoading, options]);

  return strikeData.strikePrice;
};
