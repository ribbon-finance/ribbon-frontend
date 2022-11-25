import moment, { Moment } from "moment";
import { AssetOptions } from "./deribit";
import { getNextFridayTimestamp } from "./math";
import { Asset, ROUNDING } from "../constants/deribitConstants";

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

export interface StrikeData {
  delta: number;
  strike: number;
  price: number;
}

export type RealizedVols = Record<string, number[]>;

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

const IV_ALT_CHARGE = 30;
const WINDOW_LINEAR_REGRESSION = 30;

export interface regressionParams {
  intercept: number;
  slope: number;
}

export const getLinearRegression = (
  valuesY: number[],
  valuesX: number[]
): regressionParams => {
  var sumX = 0;
  var sumY = 0;
  var sumXY = 0;
  var sumXX = 0;
  var count = 0;

  /*
   * We'll use those variables for faster read/write access.
   */
  var x = 0;
  var y = 0;
  var valuesLength = valuesX.length;

  if (valuesLength !== valuesY.length) {
    throw new Error(
      "The parameters values_x and values_y need to have the same size!"
    );
  }

  /*
   * Nothing to do.
   */

  let results: regressionParams;
  if (valuesLength === 0) {
    return (results = { intercept: 0, slope: 0 });
  }

  /*
   * Calculate the sum for each of the parts necessary.
   */
  for (let v = 0; v < valuesLength; v++) {
    x = valuesX[v];
    y = valuesY[v];
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
    count++;
  }

  /*
   * Calculate m and b for the formular:
   * y = x * m + b
   */
  var m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
  var b = sumY / count - (m * sumX) / count;

  /*
   * We will make the x and y result line now
   */
  var resultValuesX = [];
  var resultValuesY = [];

  for (let v = 0; v < valuesLength; v++) {
    x = valuesX[v];
    y = x * m + b;
    resultValuesX.push(x);
    resultValuesY.push(y);
  }

  results = { intercept: b, slope: m };
  return results;
};

export const rollingLinearRegression = (
  valuesY: number[],
  valuesX: number[],
  window: number
): regressionParams[] => {
  if (valuesX.length !== valuesY.length) {
    throw new Error(
      "The parameters values_x and values_y need to have the same size!"
    );
  }
  const results: regressionParams[] = [];
  for (let i = window; i <= valuesY.length; i++) {
    results.push(
      getLinearRegression(
        valuesY.slice(i - window, i),
        valuesX.slice(i - window, i)
      )
    );
  }
  return results;
};

/* The cummulative Normal distribution function: */
const CND = (x: number): number => {
  if (x < 0) {
    return 1 - CND(-x);
  } else {
    const k = 1 / (1 + 0.2316419 * x);
    return (
      1 -
      (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) *
        k *
        (0.31938153 +
          k *
            (-0.356563782 +
              k * (1.781477937 + k * (-1.821255978 + k * 1.330274429))))
    );
  }
};

export interface StrikeData {
  delta: number;
  strike: number;
  price: number;
}

export const blackScholes = (
  isPut: boolean,
  spot: number,
  strike: number,
  iv: number,
  timeLeftInYears: number = 0.019178,
  riskFreeRate: number = 0
): { delta: number; price: number } => {
  const d1 =
    (Math.log(spot / strike) +
      (riskFreeRate + (iv * iv) / 2) * timeLeftInYears) /
    (iv * Math.sqrt(timeLeftInYears));
  const d2 = d1 - iv * Math.sqrt(timeLeftInYears);
  const delta = isPut ? CND(d1) - 1 : CND(d1);

  if (isPut) {
    const price =
      strike * Math.exp(-riskFreeRate * timeLeftInYears) * CND(-d2) -
      spot * CND(-d1);
    return { delta, price };
  } else {
    const price =
      spot * CND(d1) -
      strike * Math.exp(-riskFreeRate * timeLeftInYears) * CND(d2);
    return { delta, price };
  }
};

export const get10dStrikeWithBSM = (
  isPut: boolean,
  spot: number,
  step: number,
  iv: number
) => {
  return getStrikeAtDeltaWithBSM(isPut, spot, step, iv, isPut ? -0.1 : 0.1);
};

export const getTimeLeftInYears = (expiryTimestamp: number) => {
  const timeToExpiry = expiryTimestamp - Math.floor(+new Date() / 1000);
  return timeToExpiry / (60 * 60 * 24 * 365);
};

const getStrikeAtDeltaWithBSM = (
  isPut: boolean,
  spot: number,
  step: number,
  iv: number,
  targetDelta: number
): StrikeData => {
  if (!spot) {
    throw new Error("Spot should not be 0");
  }

  const timeLeft = getTimeLeftInYears(getNextFridayTimestamp());
  let currentStrike = spot + step * (isPut ? -1 : 1) - (spot % step);
  let currentDelta = isPut ? -1 : 1;
  let last2Strikes: StrikeData[] = [];

  while (isPut ? currentDelta <= targetDelta : currentDelta >= targetDelta) {
    let { delta, price } = blackScholes(
      isPut,
      spot,
      currentStrike,
      iv,
      timeLeft
    );

    // we maintain only 2 values for memory efficiency
    if (last2Strikes.length !== 1) {
      last2Strikes.shift();
    }
    last2Strikes.push({
      delta,
      strike: currentStrike,
      price: setFloatToPrecision(price, 5),
    });

    currentDelta = delta;
    currentStrike =
      currentStrike + step * (isPut ? -1 : 1) - (currentStrike % step);
  }

  if (last2Strikes.length === 1) {
    return {
      delta: last2Strikes[0].delta,
      strike: last2Strikes[0].strike,
      price: last2Strikes[0].price,
    };
  }

  // We have a preference for the earlier entry (index 0) because it is of a higher delta
  if (
    Math.abs(last2Strikes[0].delta - targetDelta) <=
    Math.abs(last2Strikes[1].delta - targetDelta)
  ) {
    return {
      delta: last2Strikes[0].delta,
      strike: last2Strikes[0].strike,
      price: last2Strikes[0].price,
    };
  }
  return {
    delta: last2Strikes[1].delta,
    strike: last2Strikes[1].strike,
    price: last2Strikes[1].price,
  };
};

export const computeModelIVforAlts = (
  refAsset: Asset,
  isPut: boolean,
  altcoin: Asset,
  refSpotPrice: number,
  options: AssetOptions,
  realizedVols: RealizedVols
): [number, number] => {
  // compute call / put skew based on isput boolean for reference asset
  // const { prices: spotPrices, refreshSpotPrices } = useSpotPrices();
  // const spot = spotPrices[refAsset] || 0;
  // const { options } = useDeribitContext();

  const atmfIv = getStrikeAtDeltaFromDeribit(
    false,
    refSpotPrice,
    ROUNDING[refAsset],
    options[refAsset],
    0.5
  ).markIV;
  let iv10d;
  if (isPut) {
    iv10d = getStrikeAtDeltaFromDeribit(
      isPut,
      refSpotPrice,
      ROUNDING[refAsset],
      options[refAsset],
      -0.1
    ).markIV;
  } else {
    iv10d = getStrikeAtDeltaFromDeribit(
      isPut,
      refSpotPrice,
      ROUNDING[refAsset],
      options[refAsset],
      0.1
    ).markIV;
  }
  const skew = iv10d / atmfIv - 1;

  // get last month realised vol for reference asset and alt

  let realisedVolRef = realizedVols[refAsset];
  let realisedVolAlt = realizedVols[altcoin];

  // trim the realisedVol array to be the same size for both assets
  if (realisedVolAlt.length !== realisedVolRef.length) {
    const minLen = Math.min(realisedVolAlt.length, realisedVolRef.length);
    realisedVolRef = realisedVolRef.slice(0, minLen);
    realisedVolAlt = realisedVolAlt.slice(0, minLen);
  }

  // run regression on last month data, we remove the last value which uses intraday data

  const params = rollingLinearRegression(
    realisedVolAlt.slice(0, -1),
    realisedVolRef.slice(0, -1),
    WINDOW_LINEAR_REGRESSION
  );
  // apply parameters to ATMf implied vol of reference asset

  const extractedParams = params.slice(params.length - 1)[0];

  const altAtmf =
    atmfIv * extractedParams.slope + extractedParams.intercept * 100;

  // apply skew adjustement to ATMf implied vol of alt
  const markIV: number = altAtmf * (1 + skew);

  // apply vol charge

  const bidIV: number = markIV - IV_ALT_CHARGE;

  return [markIV, bidIV];
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
