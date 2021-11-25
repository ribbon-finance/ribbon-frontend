import { useMemo } from "react";
import moment, { Moment } from "moment";
import { BigNumber } from "@ethersproject/bignumber";

import {
  getAssets,
  isPutVault,
  VaultList,
  VaultOptions,
  VaultVersion,
  VaultVersionList,
  VaultFees,
} from "../constants/constants";
import {
  VaultActivityMeta,
  VaultOptionTrade,
  VaultShortPosition,
} from "../models/vault";
import { getAssetDecimals } from "../utils/asset";
import useVaultActivity, { useAllVaultActivities } from "./useVaultActivity";
import { assetToFiat, formatOption } from "../utils/math";
import { useAssetsPrice } from "./useAssetPrice";
import { formatUnits } from "@ethersproject/units";

const calculateV1APY = (depositAmount: number, premium: number) => {
  return ((1 + (premium / depositAmount) * 0.9) ** 52 - 1) * 100;
};

const calculateV2APY = (
  vaultOption: VaultOptions,
  depositAmount: number,
  premium: number
) => {
  const managementFee =
    (premium + depositAmount) *
    (parseFloat(VaultFees[vaultOption].v2?.managementFee || "0") / 100 / 52);
  // Performance fees are directly applied on earnings
  const performanceFee =
    premium *
    (parseFloat(VaultFees[vaultOption].v2?.performanceFee || "0") / 100);

  const calculatedApy =
    ((1 + (premium - managementFee - performanceFee) / depositAmount) ** 52 -
      1) *
    100;
  return calculatedApy > 0 ? calculatedApy : 0;
};

export const useLatestOption = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const asset = getAssets(vaultOption);
  const { activities, loading: activityLoading } = useVaultActivity(
    vaultOption,
    vaultVersion
  );
  const { prices, loading: assetPriceLoading } = useAssetsPrice();

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
              assetToFiat(shortPosition.depositAmount, prices[asset]!, decimals)
            ) / formatOption(shortPosition.strikePrice)
          : parseFloat(formatUnits(shortPosition.depositAmount, decimals)),
        isPut: isPut,
      };
    });
  }, [activities, asset, prices, vaultOption]);

  return {
    option: optionHistory.length > 0 ? optionHistory[0] : undefined,
    optionHistory,
    loading: activityLoading || assetPriceLoading,
  };
};

export const useLatestOptions = () => {
  const { activities: allActivities, loading: activityLoading } =
    useAllVaultActivities();
  const { prices, loading: assetPriceLoading } = useAssetsPrice();

  const options = useMemo(
    () =>
      Object.fromEntries(
        VaultVersionList.map((version) => [
          version,
          Object.fromEntries(
            VaultList.map((vaultOption) => {
              const asset = getAssets(vaultOption);
              const activities = allActivities[version][vaultOption];
              const sortedActivities = activities
                .filter((activity) => activity.type === "minting")
                .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1));
              if (sortedActivities.length <= 0) {
                return [vaultOption, []];
              }

              return [
                vaultOption,
                sortedActivities.map((_shortPosition) => {
                  const shortPosition = _shortPosition as VaultShortPosition &
                    VaultActivityMeta & { type: "minting" };
                  const optionTraded = activities.filter(
                    (activity) =>
                      activity.type === "sales" &&
                      activity.vaultShortPosition.id === shortPosition.id
                  ) as (VaultOptionTrade &
                    VaultActivityMeta & { type: "sales" })[];

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
                            prices[asset]!,
                            decimals
                          )
                        ) / formatOption(shortPosition.strikePrice)
                      : parseFloat(
                          formatUnits(shortPosition.depositAmount, decimals)
                        ),
                    isPut: isPut,
                  };
                }),
              ];
            })
          ),
        ])
      ) as {
        [version in VaultVersion]: {
          [option in VaultOptions]: {
            strike: BigNumber;
            expiry: Moment;
            premium: BigNumber;
            depositAmount: BigNumber;
            amount: number;
            isPut: boolean;
          }[];
        };
      },
    [allActivities, prices]
  );

  return {
    options,
    loading: activityLoading || assetPriceLoading,
  };
};
