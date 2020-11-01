import { Product, Instrument } from "./models";

type Yield = {
  currencySymbol: string;
  percentage: number;
};

export const calculateYield = (
  paymentTokenAmount: number,
  instrument: Instrument,
  product: Product
): Yield[] => {
  const { strikePrice, instrumentSpotPrice } = instrument;

  // target yield, when settlePrice < strikePrice
  const strikeAmount = paymentTokenAmount / strikePrice;
  const dTokenAmount = paymentTokenAmount / instrumentSpotPrice;
  const targetYield = (dTokenAmount / strikeAmount - 1) * 100;

  // payment yield, when settlePrice >= strikePrice
  const settlementAmount = dTokenAmount * strikePrice;
  const paymentYield = (settlementAmount / paymentTokenAmount - 1) * 100;

  return [
    {
      currencySymbol: product.paymentCurrency,
      percentage: paymentYield
    },
    {
      currencySymbol: product.targetCurrency,
      percentage: targetYield
    }
  ];
};

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
