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
  const { option: currentOption } = useLatestOption(vaultOption, vaultVersion);

  const { prices } = useAssetsPrice();
  const optionAsset = getOptionAssets(vaultOption);

  const strikePrice = useCallback(
    (formatted: boolean = true) => {
      const chain = getVaultChain(vaultOption);

      if (!currentOption) return "---";
      if (currentOption.loading) return loadingText;

      if (formatted) {
        return currency(
          formatOptionStrike(currentOption.strike, chain)
        ).format();
      } else {
        return formatOptionStrike(currentOption.strike, chain);
      }
    },
    [currentOption, loadingText, vaultOption]
  );

  const currentPrice = useCallback(
    (formatted: boolean = true) => {
      if (prices[optionAsset].loading) return loadingText;

      if (formatted) {
        return currency(prices[optionAsset].price!).format();
      } else {
        return Number(prices[optionAsset].price.toFixed(2));
      }
    },
    [loadingText, optionAsset, prices]
  );

  return {
    strikePrice,
    currentPrice,
    isLoading: currentOption?.loading || prices[optionAsset].loading,
  };
};

export default useStrikePrice;
