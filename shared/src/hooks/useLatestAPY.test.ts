import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";

import { VaultFees } from "../constants/constants";
import { VaultPriceHistory } from "../models/vault";
import { calculateAPYFromPriceHistory } from "./useLatestAPY";

/**
 * Base price per share is the base where all the calculation based on.
 * Different alphabet represent a percentage calculated on top of the base. They can be stacked.
 * For example, while A means 5% increment from base, AA mean 5% increment on top of the 5% increment
 * from base.
 * Following is the list of alphabet and their representation.
 * A: +5%
 * B: +10%
 * F: -5%
 */
const basePricePerShare = BigNumber.from((10 ** 18).toString());
const pricePerShareA = basePricePerShare.mul(105).div(100);
const pricePerShareAB = pricePerShareA.mul(110).div(100);

const pastFriday = moment()
  .isoWeekday("friday")
  .utc()
  .set("hour", 10)
  .set("minute", 0)
  .set("second", 0)
  .set("millisecond", 0);

if (pastFriday.isAfter(moment())) {
  pastFriday.subtract(1, "week");
}

/**
 * For V1 vault that does not use yield-token as collateral,
 * we simply take the latest auction close yield to interpolate the APY
 */
it("V1 Vault performance (non yield-token collaterized)", () => {
  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: pastFriday
        .clone()
        .subtract(1, "weeks")
        .add(30, "minutes")
        .unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: pastFriday.clone().add(30, "minutes").unix(),
    },
    {
      pricePerShare: pricePerShareAB,
      timestamp: pastFriday.clone().add(2, "hours").unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(
    priceHistory,
    18,
    { vaultOption: "rETH-THETA", vaultVersion: "v1" },
    0
  );

  /**
   * In this case, latest week had gained by 10%,
   * therefore APY should be annulized of weekly 10% gain
   */
  expect(result).toBe((1.1 ** 52 - 1) * 100);
});

/**
 * For V1 vault that does use yield-token as collateral,
 * we take the latest auction close yield to interpolate the APY
 * and then add underlying yield token yield on top of it
 */
it("V1 Vault performance (yield-token collaterized)", () => {
  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: pastFriday
        .clone()
        .subtract(1, "weeks")
        .add(30, "minutes")
        .unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: pastFriday.clone().add(30, "minutes").unix(),
    },
    {
      pricePerShare: pricePerShareAB,
      timestamp: pastFriday.clone().add(2, "hours").unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(
    priceHistory,
    18,
    { vaultOption: "ryvUSDC-ETH-P-THETA", vaultVersion: "v1" },
    2
  );

  /**
   * In this case, latest week had gained by 10%,
   * therefore APY should be annulized of weekly 10% gain, plus 2% from yield token
   */
  expect(result).toBe((1.1 ** 52 - 1) * 100 + 2);
});

/**
 * For V2 vault that does not use yield-token as collateral,
 * we simply take the latest auction close yield, minus fees and interpolate APY
 */
it("V2 Vault performance (non yield-token collaterized)", () => {
  const vaultOption = "rETH-THETA";
  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: pastFriday.clone().add(30, "minutes").unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: pastFriday.clone().add(2, "hours").unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(
    priceHistory,
    18,
    { vaultOption: vaultOption, vaultVersion: "v2" },
    0
  );

  /**
   * We first calculate price per share after annualized management fees are charged
   */
  const endingPricePerShareAfterManagementFees =
    1.05 *
    (1 - parseFloat(VaultFees[vaultOption].v2?.managementFee!) / 100 / 52);
  /**
   * Next, we calculate how much performance fees will lower the pricePerShare
   */
  const performanceFeesImpact =
    0.05 * (parseFloat(VaultFees[vaultOption].v2?.performanceFee!) / 100);
  /**
   * Finally, we calculate price per share after both fees
   */
  const pricePerShareAfterFees =
    endingPricePerShareAfterManagementFees - performanceFeesImpact;

  /**
   * In this case, latest week had gained by 10%, therefore APY should be annulized of weekly 10% gain minus fees
   */
  expect(result).toBe((pricePerShareAfterFees ** 52 - 1) * 100);
});

/**
 * For V2 vault that does use yield-token as collateral,
 * we take the latest auction close yield, minus fees and interpolate APY,
 * and add yield token yield
 */
it("V2 Vault performance (yield-token collaterized)", () => {
  const vaultOption = "rstETH-THETA";
  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: pastFriday.clone().add(30, "minutes").unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: pastFriday.clone().add(2, "hours").unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(
    priceHistory,
    18,
    { vaultOption: vaultOption, vaultVersion: "v2" },
    5
  );

  /**
   * We first calculate price per share after annualized management fees are charged
   */
  const endingPricePerShareAfterManagementFees =
    1.05 *
    (1 - parseFloat(VaultFees[vaultOption].v2?.managementFee!) / 100 / 52);
  /**
   * Next, we calculate how much performance fees will lower the pricePerShare
   */
  const performanceFeesImpact =
    0.05 * (parseFloat(VaultFees[vaultOption].v2?.performanceFee!) / 100);
  /**
   * Finally, we calculate price per share after both fees
   */
  const pricePerShareAfterFees =
    endingPricePerShareAfterManagementFees - performanceFeesImpact;

  /**
   * In this case, latest week had gained by 10%, therefore APY should be annulized of weekly 10% gain minus fees
   */
  expect(result).toBe((pricePerShareAfterFees ** 52 - 1) * 100 + 5);
});
