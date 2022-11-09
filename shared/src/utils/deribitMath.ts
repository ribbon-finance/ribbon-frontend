import moment, { Moment } from "moment";
import { Asset } from "./deribit";

export interface Option {
  asset: Asset;
  delta: number;
  bidPrice: number;
  bidPriceInUSD: number;
  strikePrice: number;
  bidIV: number;
  markIV: number;
  markPrice: number;
}

export const getLastFridayOfMonthTimestamp = () => {
  let result;
  result = moment().endOf("month");
  while (result.day() !== 5) {
    result.subtract(1, "day");
  }

  if (result < moment()) {
    result = moment().add(7, "day").endOf("month");
  }

  while (result.day() !== 5) {
    result.subtract(1, "day");
  }

  return (result as Moment).hours(8).minutes(0).seconds(0).unix();
};

export interface StrikeData {
  delta: number;
  strike: number;
  price: number;
}

export const get10dStrikeFromDeribit = (
  isPut: boolean,
  spot: number,
  step: number,
  options: Record<number, Option>
) => {
  return getStrikeAtDeltaFromDeribit(
    isPut,
    spot,
    step,
    linearlyInterpolateOptionChain(options, step),
    isPut ? -0.1 : 0.1
  );
};

const getStrikeAtDeltaFromDeribit = (
  isPut: boolean,
  spot: number,
  step: number,
  options: Record<number, Option>,
  targetDelta: number
): Option => {
  if (!spot) {
    throw new Error("Spot should not be 0");
  }

  let currentStrike = spot + 2 * step * (isPut ? -1 : 1) - (spot % step);
  let currentDelta = isPut ? -1 : 1;
  let last2Strikes: Option[] = [];
  if (!options[currentStrike]) {
    throw new Error("Options chain not fully loaded");
  }
  while (isPut ? currentDelta <= targetDelta : currentDelta >= targetDelta) {
    const { delta } = options[currentStrike];
    // we maintain only 2 values for memory efficiency
    if (last2Strikes.length !== 1) {
      last2Strikes.shift();
    }
    last2Strikes.push(options[currentStrike]);

    currentDelta = delta;
    const nextStrike =
      currentStrike + step * (isPut ? -1 : 1) - (currentStrike % step);

    // This means the option does not exist on the option chain and we just default to the last option on the chain
    if (!options[nextStrike]) {
      last2Strikes.push(options[currentStrike]);
      break;
    }

    currentStrike = nextStrike;
  }

  // If there is only 1 element in last2Strikes, we default to the only 1
  if (last2Strikes.length === 1) {
    return last2Strikes[0];
  }

  // We have a preference for the earlier entry (index 0) because it is of a higher delta
  if (
    Math.abs(last2Strikes[0].delta - targetDelta) <=
    Math.abs(last2Strikes[1].delta - targetDelta)
  ) {
    return last2Strikes[0];
  }
  return last2Strikes[1];
};

const setFloatToPrecision = (n: number, precision: number): number =>
  parseFloat(n.toFixed(precision));

/**
 *
 * @param options The current option chain
 * @return newOptions which is the updated interpolated option chain
 */
const linearlyInterpolateOptionChain = (
  options: Record<number, Option>,
  step: number
): Record<number, Option> => {
  let newOptions = { ...options };
  const strikes = Object.keys(options)
    .map((s) => parseInt(s))
    .sort();

  // Find gaps in the option chain and we fill the gaps with interpolated data
  for (let i = 0; i < strikes.length; i++) {
    if (i === 0) continue;

    const prevStrike = strikes[i - 1];
    const currentStrike = strikes[i];

    if (currentStrike - prevStrike > step) {
      const missingSteps = Math.floor((currentStrike - prevStrike) / step);

      for (let j = 1; j < missingSteps; j++) {
        const interpolatedStrike = Math.floor(prevStrike + step * j);
        const delta = setFloatToPrecision(
          (newOptions[currentStrike].delta + newOptions[prevStrike].delta) /
            missingSteps,
          5
        );
        const bidPrice = setFloatToPrecision(
          (newOptions[currentStrike].bidPrice +
            newOptions[prevStrike].bidPrice) /
            missingSteps,
          5
        );
        const bidPriceInUSD = setFloatToPrecision(
          (newOptions[currentStrike].bidPriceInUSD +
            newOptions[prevStrike].bidPriceInUSD) /
            missingSteps,
          5
        );
        const bidIV = setFloatToPrecision(
          (newOptions[currentStrike].bidIV + newOptions[prevStrike].bidIV) /
            missingSteps,
          5
        );
        const markIV = setFloatToPrecision(
          (newOptions[currentStrike].markIV + newOptions[prevStrike].markIV) /
            missingSteps,
          5
        );

        const markPrice = setFloatToPrecision(
          (newOptions[currentStrike].markPrice +
            newOptions[prevStrike].markPrice) /
            missingSteps,
          5
        );

        newOptions[interpolatedStrike] = {
          strikePrice: interpolatedStrike,
          asset: newOptions[currentStrike].asset,
          delta,
          bidPrice,
          bidPriceInUSD,
          bidIV,
          markIV,
          markPrice,
        };
      }
    }
  }
  return newOptions;
};
