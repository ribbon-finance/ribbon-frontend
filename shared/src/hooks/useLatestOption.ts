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

  const option = useMemo(() => {
    const sortedActivities = activities
      .filter((activity) => activity.type === "minting")
      .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1));
    if (sortedActivities.length <= 0) {
      return undefined;
    }
    const latestShortPosition = sortedActivities[0] as VaultShortPosition &
      VaultActivityMeta & { type: "minting" };
    const optionTraded = activities.filter(
      (activity) =>
        activity.type === "sales" &&
        activity.vaultShortPosition.id === latestShortPosition.id
    ) as (VaultOptionTrade & VaultActivityMeta & { type: "sales" })[];

    const decimals = getAssetDecimals(asset);
    const isPut = isPutVault(vaultOption);

    return {
      strike: latestShortPosition.strikePrice,
      expiry: moment(latestShortPosition.expiry, "X"),
      premium: optionTraded.reduce(
        (acc, curr) => acc.add(curr.premium),
        BigNumber.from(0)
      ),
      depositAmount: latestShortPosition.depositAmount,
      amount: isPut
        ? parseFloat(
            assetToFiat(
              latestShortPosition.depositAmount,
              prices[asset]!,
              decimals
            )
          ) / formatOption(latestShortPosition.strikePrice)
        : parseFloat(formatUnits(latestShortPosition.depositAmount, decimals)),
      isPut: isPut,
    };
  }, [activities, asset, prices, vaultOption]);

  return { option, loading: activityLoading || assetPriceLoading };
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
                return [vaultOption, undefined];
              }
              const latestShortPosition =
                sortedActivities[0] as VaultShortPosition &
                  VaultActivityMeta & { type: "minting" };
              const optionTraded = activities.filter(
                (activity) =>
                  activity.type === "sales" &&
                  activity.vaultShortPosition.id === latestShortPosition.id
              ) as (VaultOptionTrade & VaultActivityMeta & { type: "sales" })[];

              const decimals = getAssetDecimals(asset);
              const isPut = isPutVault(vaultOption);

              return [
                vaultOption,
                {
                  strike: latestShortPosition.strikePrice,
                  expiry: moment(latestShortPosition.expiry, "X"),
                  premium: optionTraded.reduce(
                    (acc, curr) => acc.add(curr.premium),
                    BigNumber.from(0)
                  ),
                  depositAmount: latestShortPosition.depositAmount,
                  amount: isPut
                    ? parseFloat(
                        assetToFiat(
                          latestShortPosition.depositAmount,
                          prices[asset]!,
                          decimals
                        )
                      ) / formatOption(latestShortPosition.strikePrice)
                    : parseFloat(
                        formatUnits(latestShortPosition.depositAmount, decimals)
                      ),
                  isPut: isPut,
                },
              ];
            })
          ),
        ])
      ) as {
        [version in VaultVersion]: {
          [option in VaultOptions]:
            | {
                strike: BigNumber;
                expiry: Moment;
                premium: BigNumber;
                depositAmount: BigNumber;
                amount: number;
                isPut: boolean;
              }
            | undefined;
        };
      },
    [allActivities, prices]
  );

  return { options, loading: activityLoading || assetPriceLoading };
};

export const useLatestAPY = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion
) => {
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const { option, loading } = useLatestOption(vaultOption, vaultVersion);

  const latestAPY = useMemo(() => {
    if (!option) {
      return 0;
    }

    const premium = parseFloat(formatUnits(option.premium, decimals));
    const depositAmount = parseFloat(
      formatUnits(option.depositAmount, decimals)
    );

    switch (vaultVersion) {
      case "v1":
        // For V1, we need to account for only 90% of assets are utilized
        return ((1 + (premium / depositAmount) * 0.9) ** 52 - 1) * 100;
      case "v2":
        // Management fees are annualized, therefore we divide by 52
        const managementFee =
          (premium + depositAmount) *
          (parseFloat(VaultFees[vaultOption].v2?.managementFee || "0") /
            100 /
            52);
        // Performance fees are directly applied on earnings
        const performanceFee =
          premium *
          (parseFloat(VaultFees[vaultOption].v2?.performanceFee || "0") / 100);
        return (
          ((1 + (premium - managementFee - performanceFee) / depositAmount) **
            52 -
            1) *
          100
        );
    }
  }, [decimals, option, vaultOption, vaultVersion]);

  return { fetched: !loading, res: latestAPY };
};

export const useLatestAPYs = () => {
  const { options, loading } = useLatestOptions();

  const latestAPYs = useMemo(
    () =>
      Object.fromEntries(
        VaultVersionList.map((version) => [
          version,
          Object.fromEntries(
            VaultList.map((vaultOption) => {
              const decimals = getAssetDecimals(getAssets(vaultOption));
              const option = options[version][vaultOption];

              if (!option) {
                return [vaultOption, 0];
              }

              const premium = parseFloat(formatUnits(option.premium, decimals));
              const depositAmount = parseFloat(
                formatUnits(option.depositAmount, decimals)
              );

              switch (version) {
                case "v1":
                  // For V1, we need to account for only 90% of assets are utilized
                  return [
                    vaultOption,
                    ((1 + (premium / depositAmount) * 0.9) ** 52 - 1) * 100,
                  ];
                case "v2":
                default:
                  // Management fees are annualized, therefore we divide by 52
                  const managementFee =
                    (premium + depositAmount) *
                    (parseFloat(
                      VaultFees[vaultOption].v2?.managementFee || "0"
                    ) /
                      100 /
                      52);
                  // Performance fees are directly applied on earnings
                  const performanceFee =
                    premium *
                    (parseFloat(
                      VaultFees[vaultOption].v2?.performanceFee || "0"
                    ) /
                      100);
                  return [
                    vaultOption,
                    ((1 +
                      (premium - managementFee - performanceFee) /
                        depositAmount) **
                      52 -
                      1) *
                      100,
                  ];
              }
            })
          ),
        ])
      ) as {
        [version in VaultVersion]: {
          [option in VaultOptions]: number;
        };
      },
    [options]
  );

  return { fetched: !loading, res: latestAPYs };
};
