import { formatUnits } from "ethers/lib/utils";
import {
  VaultActivity,
  VaultActivityMeta,
  VaultOptionTrade,
} from "shared/lib/models/vault";
import { getAssetDecimals } from "shared/lib/utils/asset";
import { formatSignificantDecimals } from "shared/lib/utils/math";

// 10% fee
const FEE = 0.1;

export const getLatestYieldEarnedFromActivities = (
  vaultActivities: VaultActivity[],
  premiumDecimals: number = getAssetDecimals("USDC")
): number | undefined => {
  const latestSale = vaultActivities
    .filter((activity) => activity.type === "sales")
    .sort((a, b) => (a.date.valueOf() < b.date.valueOf() ? 1 : -1))[0] as
    | (VaultOptionTrade & VaultActivityMeta & { type: "sales" })
    | undefined;

  if (latestSale !== undefined) {
    return (
      parseFloat(
        latestSale ? formatUnits(latestSale.premium, premiumDecimals) : "0"
      ) *
      (1 - FEE)
    );
  }

  return undefined;
};

export const getPremiumsAfterFeesFromVaultActivities = (
  vaultActivities: VaultActivity[],
  premiumDecimals: number = getAssetDecimals("USDC")
) => {
  const yields = vaultActivities
    .map((activity) => {
      return activity.type === "sales"
        ? Number(activity.premium) * (1 - FEE)
        : 0;
    })
    .reduce((totalYield, roundlyYield) => totalYield + roundlyYield, 0);

  return parseFloat(
    formatSignificantDecimals(formatUnits(yields, premiumDecimals), 2)
  );
};
