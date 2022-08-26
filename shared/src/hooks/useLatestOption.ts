import { useMemo } from "react";
import moment from "moment";
import { BigNumber } from "@ethersproject/bignumber";

import {
  getAssets,
  getVaultChain,
  isPutVault,
  VaultOptions,
  VaultVersion,
} from "../constants/constants";
import {
  VaultActivityMeta,
  VaultOptionTrade,
  VaultShortPosition,
} from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import useVaultActivity from "./useVaultActivity";
import { assetToFiat, formatOptionStrike } from "../utils/math";
import { useAssetsPrice } from "./useAssetPrice";
import { formatUnits } from "@ethersproject/units";

export const useLatestOption = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const asset = getAssets(vaultOption);
  const { activities, loading: activityLoading } = useVaultActivity(
    vaultOption,
    vaultVersion
  );
  const { prices } = useAssetsPrice();
  const chain = getVaultChain(vaultOption);

  const optionHistory = useMemo(() => {
    const sortedActivities = activities
      .filter((activity) => activity.type === "minting")
      .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1));
    if (sortedActivities.length <= 0) {
      return [];
    }

    return sortedActivities.map((_shortPosition) => {
      const shortPosition = _shortPosition as VaultShortPosition &
        VaultActivityMeta & { type: "minting" };
      const optionTraded = activities.filter(
        (activity) =>
          activity.type === "sales" &&
          activity.vaultShortPosition.id === shortPosition.id
      ) as (VaultOptionTrade & VaultActivityMeta & { type: "sales" })[];

      const decimals = getAssetDecimals(asset);
      const isPut = isPutVault(vaultOption);

      return {
        strike: shortPosition.strikePrice,
        expiry: moment(shortPosition.expiry, "X"),
        premium: optionTraded.reduce(
          (acc, curr) => acc.add(curr.premium),
          BigNumber.from(0)
        ),
        depositAmount: shortPosition.depositAmount,
        amount: isPut
          ? parseFloat(
              assetToFiat(
                shortPosition.depositAmount,
                prices[asset].price,
                decimals
              )
            ) / formatOptionStrike(shortPosition.strikePrice, chain)
          : parseFloat(formatUnits(shortPosition.depositAmount, decimals)),
        isPut: isPut,
        loading: activityLoading || prices[asset].loading,
      };
    });
  }, [activities, asset, vaultOption, prices, chain, activityLoading]);

  return {
    option: optionHistory.length > 0 ? optionHistory[0] : undefined,
    optionHistory,
  };
};
