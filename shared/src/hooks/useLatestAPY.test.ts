import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";

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
const pricePerShareAF = pricePerShareA.mul(95).div(100);
const pricePerShareAFB = pricePerShareAF.mul(110).div(100);

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
 * This is a typical case where we estimate APY based on the latest yield generated from the past
 * friday's contract sold
 */
it("Non yield-token collaterized vault", () => {
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

  const result = calculateAPYFromPriceHistory(priceHistory, 18, false);

  /**
   * It should take the latest yield earn, which is 10% increment from last week close short on this
   * week 10AM UTC and interpolate with 52 weeks
   */
  expect(result).toBe((1.1 ** 52 - 1) * 100);
});

/**
 * This is a typical case for vault with yield-token collaterized where we will estimate APY based on
 * previous whole week performance so yield-token APY are also accounted into the calculation.
 * This test case test on weeks where previous week are ITM
 */
it("Yield-token collaterized vault on ITM week", () => {
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

  const result = calculateAPYFromPriceHistory(priceHistory, 18, true);

  /**
   * It should take the latest yield earn, which is 5% increment from 10AM UTC previous week and
   * interpolate with 52 weeks
   */
  expect(result).toBe((1.05 ** 52 - 1) * 100);
});

/**
 * This is test case for vault with yield-token collaterized where we will estimate APY based on
 * previous profitable whole week performance so yield-token APY are also accounted into the
 * calculation.
 * This is mainly due to unable to estimate accurately when option are exercised.
 */
it("Yield-token collaterized vault on OTM week", () => {
  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: pastFriday
        .clone()
        .subtract(2, "weeks")
        .add(30, "minutes")
        .unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: pastFriday
        .clone()
        .subtract(1, "weeks")
        .add(30, "minutes")
        .unix(),
    },
    {
      pricePerShare: pricePerShareAF,
      timestamp: pastFriday.clone().add(30, "minutes").unix(),
    },
    {
      pricePerShare: pricePerShareAFB,
      timestamp: pastFriday.clone().add(2, "hours").unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(priceHistory, 18, true);

  /**
   * It should take the latest yield earn, which is 5% increment from 10AM UTC 2 weeks ago and
   * interpolate with 52 weeks
   */
  expect(result).toBe((1.05 ** 52 - 1) * 100);
});

/**
 * This test case test cases where a non yield-token collaterized vault are less than a week old and
 * without option sold
 */
it("Newly created non yield-token collaterized vault with less than a week old, without option sold", () => {
  const durationFromPastFriday = moment.duration(moment().diff(pastFriday));
  /**
   * A random time between last friday and now where the contract is created
   */
  const contractCreationTime = pastFriday
    .clone()
    .add(durationFromPastFriday.asSeconds() / 2, "seconds");

  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: contractCreationTime.unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(priceHistory, 18, false);

  expect(result).toBe(0);
});

/**
 * This test case test cases where a yield-token collaterized vault are less than a week old and
 * without option sold
 */
it("Newly created yield-token collaterized vault with less than a week old, without option sold", () => {
  const durationFromPastFriday = moment.duration(moment().diff(pastFriday));
  /**
   * A random time between last friday and now where the contract is created
   */
  const contractCreationTime = pastFriday
    .clone()
    .add(durationFromPastFriday.asSeconds() / 2, "seconds");

  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: contractCreationTime.unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(priceHistory, 18, true);

  expect(result).toBe(0);
});

/**
 * This test case test cases where a non yield-token collaterized vault are less than a week old and
 * with option sold
 */
it("Newly created non yield-token collaterized vault with less than a week old, with option sold", () => {
  const durationFromPastFriday = moment.duration(moment().diff(pastFriday));
  /**
   * A random time between last friday and now where the contract is created
   */
  const contractCreationTime = pastFriday
    .clone()
    .add(durationFromPastFriday.asSeconds() / 2, "seconds");
  const optionSoldTime = contractCreationTime
    .clone()
    .add(durationFromPastFriday.asSeconds() / 4, "seconds");

  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: contractCreationTime.unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: optionSoldTime.unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(priceHistory, 18, false);

  expect(result).toBe((1.05 ** 52 - 1) * 100);
});

/**
 * This test case test cases where a yield-token collaterized vault are less than a week old and
 * with option sold
 */
it("Newly created yield-token collaterized vault with less than a week old, with option sold", () => {
  const durationFromPastFriday = moment.duration(moment().diff(pastFriday));
  /**
   * A random time between last friday and now where the contract is created
   */
  const contractCreationTime = pastFriday
    .clone()
    .add(durationFromPastFriday.asSeconds() / 2, "seconds");
  const optionSoldTime = contractCreationTime
    .clone()
    .add(durationFromPastFriday.asSeconds() / 4, "seconds");

  const priceHistory: VaultPriceHistory[] = [
    {
      pricePerShare: basePricePerShare,
      timestamp: contractCreationTime.unix(),
    },
    {
      pricePerShare: pricePerShareA,
      timestamp: optionSoldTime.unix(),
    },
  ];

  const result = calculateAPYFromPriceHistory(priceHistory, 18, true);

  expect(result).toBe((1.05 ** 52 - 1) * 100);
});
