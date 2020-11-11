import { Product, Instrument } from "../models";
import { etherToDecimals } from "./math";

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
    { amount: y.amount, percentage: y.percentage },
  ]);

  return new Map(keyVals);
};

export const calculateYield = (
  paymentTokenAmount: number,
  instrument: Instrument,
  product: Product,
  targetSpotPrice: number
): Yield[] => {
  const { strikePrice, instrumentSpotPrice } = instrument;

  const spotPriceInPaymentCurrency = etherToDecimals(instrumentSpotPrice);

  // target yield, when settlePrice < strikePrice
  const strikeAmount = paymentTokenAmount / spotPriceInPaymentCurrency;

  const targetYield = (1 - spotPriceInPaymentCurrency) * 100;

  // payment yield, when settlePrice >= strikePrice
  const originalInvestment =
    paymentTokenAmount / etherToDecimals(instrumentSpotPrice);

  // const investmentUSD = originalInvestment * targetSpotPrice;
  const investmentUSD = paymentTokenAmount * targetSpotPrice;
  const paymentAmount = originalInvestment * strikePrice;
  const paymentYield = ((paymentAmount - investmentUSD) / investmentUSD) * 100;
  // const paymentYield = (strikePrice / spotPriceInUSD - 1) * 100;

  console.log(`investmentUSD ${investmentUSD}, paymentAmount ${paymentAmount}`);

  return [
    {
      currencySymbol: "USD",
      amount: paymentAmount,
      percentage: paymentYield,
    },
    {
      currencySymbol: product.targetCurrency,
      amount: strikeAmount,
      percentage: targetYield,
    },
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
  return Math.pow(1 + yieldPercent / 100, periods - 1) * 100;
};
