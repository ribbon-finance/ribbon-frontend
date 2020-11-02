import { Product, Instrument } from "./models";

type YieldNumber = {
  amount: number;
  percentage: number;
};
type Yield = {
  currencySymbol: string;
} & YieldNumber;

export const transposeYieldByCurrency = (yields: Yield[]) => {
  const keyVals = yields.map((y): [string, YieldNumber] => [
    y.currencySymbol,
    { amount: y.amount, percentage: y.percentage }
  ]);

  return new Map(keyVals);
};

export const calculateYield = (
  paymentTokenAmount: number,
  instrument: Instrument,
  product: Product
): Yield[] => {
  const { targetSpotPrice, strikePrice, instrumentSpotPrice } = instrument;

  // target yield, when settlePrice < strikePrice
  const strikeAmount = paymentTokenAmount / strikePrice;
  const dTokenAmount = paymentTokenAmount / instrumentSpotPrice;

  const instrumentSpotInTargetCurrency = instrumentSpotPrice / targetSpotPrice;
  const targetYield = (1 - instrumentSpotInTargetCurrency) * 100;

  // payment yield, when settlePrice >= strikePrice
  const settlementAmount = dTokenAmount * strikePrice;
  const paymentYield = (strikePrice / instrumentSpotPrice - 1) * 100;

  return [
    {
      currencySymbol: product.paymentCurrency,
      amount: settlementAmount,
      percentage: paymentYield
    },
    {
      currencySymbol: product.targetCurrency,
      amount: strikeAmount,
      percentage: targetYield
    }
  ];
};

/**
 * Based on this https://www.investopedia.com/terms/a/apy.asp
 * @param yieldPercent
 * @param periodStart
 * @param periodEnd
 */
export const convertToAPY = (
  yieldPercent: number,
  periodStart: number,
  periodEnd: number
) => {
  const period = periodEnd - periodStart; // get period in seconds
  const ONE_YEAR_IN_SECOND = 31540000; // 1 year has this number of seconds
  const periods = ONE_YEAR_IN_SECOND / period;
  return Math.pow(1 + yieldPercent / 100, periods - 1);
};
