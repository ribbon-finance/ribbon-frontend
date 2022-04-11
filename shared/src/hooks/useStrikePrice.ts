import currency from "currency.js";
import { useCallback } from "react";
import {
  getOptionAssets,
  getVaultChain,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import { useLatestOption } from "../hooks/useLatestOption";
import useLoadingText from "../hooks/useLoadingText";
import { formatOptionStrike } from "../utils/math";
import { useAssetsPrice } from "./useAssetPrice";

const useStrikePrice = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const loadingText = useLoadingText();
  const { option: currentOption, loading: optionLoading } = useLatestOption(
    vaultOption,
    vaultVersion
  );

  const { prices, loading: priceLoading } = useAssetsPrice();
  const optionAsset = getOptionAssets(vaultOption);

  const strikePrice = useCallback(
    (formatted: boolean = true) => {
      const chain = getVaultChain(vaultOption);

      if (optionLoading) return loadingText;

      if (!currentOption) return "---";

      if (formatted) {
        return currency(
          formatOptionStrike(currentOption.strike, chain)
        ).format();
      } else {
        return formatOptionStrike(currentOption.strike, chain);
      }
    },
    [currentOption, loadingText, optionLoading, vaultOption]
  );

  const currentPrice = useCallback(
    (formatted: boolean = true) => {
      if (priceLoading) return loadingText;

      if (formatted) {
        return currency(prices[optionAsset]!).format();
      } else {
        return Number(prices[optionAsset].toFixed(2));
      }
    },
    [priceLoading, loadingText, optionAsset, prices]
  );

  return {
    strikePrice,
    currentPrice,
    isLoading: optionLoading || priceLoading,
  };
};

export default useStrikePrice;
