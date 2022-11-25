import {
  get10dStrikeFromDeribit,
  computeModelIVforAlts,
  get10dStrikeWithBSM,
} from "shared/lib/utils/deribitMath";
import { useMemo } from "react";
import { useAssetsPrice } from "shared/lib/hooks/useAssetPrice";
import { useDeribitContext } from "./deribitContext";
import {
  getOptionAssets,
  isPutVault,
  VaultList,
  VaultOptions,
} from "shared/lib/constants/constants";
import { VolProvider } from "./useRealizedVol";
import {
  isAltcoin,
  ROUNDING,
  getDeribitAssets,
} from "shared/lib/constants/deribitConstants";

export type StrikePriceData = {
  loading: boolean;
  strikePrice: number;
};
export type StrikePricesData = {
  [vault in VaultOptions]: StrikePriceData;
};

export const defaultStrikePricesData: StrikePricesData = Object.fromEntries(
  VaultList.map((vault) => [
    vault,
    {
      loading: true,
      strikePrice: 0,
    },
  ])
) as StrikePricesData;

export const useNextIndicativeStrikes = (): StrikePricesData => {
  const { options } = useDeribitContext();
  const { prices: spotPrices } = useAssetsPrice();
  const { realizedVol } = VolProvider();
  const StrikePricesData: StrikePricesData = useMemo(() => {
    if (
      !Object.keys(options.BTC).length ||
      !Object.keys(options.ETH).length ||
      !spotPrices ||
      !Object.keys(realizedVol).length
    ) {
      return defaultStrikePricesData;
    }
    return Object.fromEntries(
      VaultList.map((vault) => {
        const asset = getDeribitAssets(vault);
        const isPut = isPutVault(vault);
        const spotPrice = spotPrices[getOptionAssets(vault)].price as number;

        try {
          if (isAltcoin(asset) && spotPrice && spotPrices["WETH"].price) {
            const [iv] = computeModelIVforAlts(
              "ETH",
              isPut,
              asset,
              spotPrices["WETH"].price,
              options,
              realizedVol
            );

            const { strike: strikePrice } = get10dStrikeWithBSM(
              isPut,
              spotPrice,
              ROUNDING[asset],
              iv / 100
            );

            return [
              vault,
              {
                loading: false,
                strikePrice,
              },
            ];
          }

          const option = get10dStrikeFromDeribit(
            isPut,
            spotPrice,
            ROUNDING[asset],
            options[asset]
          );
          return [
            vault,
            {
              loading: false,
              strikePrice: option.strikePrice,
            },
          ];
        } catch (error) {
          return [
            vault,
            {
              loading: true,
              strikePrice: 0,
            },
          ];
        }
      })
    ) as StrikePricesData;
  }, [realizedVol, options, spotPrices]);

  return StrikePricesData;
};

export const useNextIndicativeStrike = (
  vaultOption: VaultOptions
): StrikePriceData => {
  const strikesData = useNextIndicativeStrikes();

  return strikesData[vaultOption];
};
