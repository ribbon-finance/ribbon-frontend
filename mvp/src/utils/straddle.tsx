import { BigNumber, ethers } from "ethers";
import styled from "styled-components";

const Profit = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const ProfitPositive = styled(Profit)`
  color: #06c018;
`;

const ProfitNegative = styled(Profit)`
  color: #c01515;
`;

export const computeStraddleValue = (
  callPremium: string,
  putPremium: string,
  ethPrice: number
): [string, string] => {
  const call = BigNumber.from(callPremium);
  const put = BigNumber.from(putPremium);
  const straddleCost = parseFloat(ethers.utils.formatEther(call.add(put)));
  return [(straddleCost * ethPrice).toFixed(2), straddleCost.toFixed(3)];
};

export const computeBreakeven = (
  straddleUSD: string,
  ethUSD: number
): [string, string] => {
  const straddle = parseFloat(straddleUSD);
  const lower = (ethUSD - straddle).toFixed(2);
  const upper = (ethUSD + straddle).toFixed(2);
  return [lower, upper];
};

export const computeDefaultPrice = (upperBreakeven: string, buffer: number) => {
  const defaultPrice = parseFloat(upperBreakeven) * buffer;
  return Math.round(defaultPrice);
};

export const computeGains = (
  currentAssetPrice: number,
  futureAssetPrice: number,
  instrumentPrice: number
): [string, string, boolean] => {
  if (isNaN(futureAssetPrice)) {
    return ["0.00", "0.0", true];
  }

  let dollarProfit = 0;
  if (futureAssetPrice - currentAssetPrice > 0) {
    dollarProfit = futureAssetPrice - currentAssetPrice - instrumentPrice;
  } else {
    dollarProfit = currentAssetPrice - futureAssetPrice - instrumentPrice;
  }

  const percentProfit = (dollarProfit / instrumentPrice) * 100;
  if (dollarProfit >= 0) {
    return [dollarProfit.toFixed(2), percentProfit.toFixed(1), true];
  } else {
    return [dollarProfit.toFixed(2), percentProfit.toFixed(1), false];
  }
};

export const computeGainsAmount = (
  currentAssetPrice: number,
  futureAssetPrice: number,
  instrumentPrice: number,
  amount: number
): [string, string, boolean] => {
  if (isNaN(futureAssetPrice)) {
    return ["0.00", "0.0", true];
  }

  let dollarProfit = 0;
  if (futureAssetPrice - currentAssetPrice > 0) {
    dollarProfit =
      (futureAssetPrice - currentAssetPrice - instrumentPrice) * amount;
  } else {
    dollarProfit =
      (currentAssetPrice - futureAssetPrice - instrumentPrice) * amount;
  }

  let percentProfit: number = 0;
  if (amount === 0) {
    percentProfit = (dollarProfit / instrumentPrice) * 100;
  } else {
    percentProfit = (dollarProfit / instrumentPrice / amount) * 100;
  }

  if (dollarProfit >= 0) {
    return [dollarProfit.toFixed(2), percentProfit.toFixed(1), true];
  } else {
    return [dollarProfit.toFixed(2), percentProfit.toFixed(1), false];
  }
};

export const formatProfit = (
  dollarProfit: string,
  percentProfit: string,
  profitPositive: boolean
) => {
  if (dollarProfit === "0.00") {
    return <Profit>$0.00 (+0%)</Profit>;
  }
  if (profitPositive) {
    return (
      <ProfitPositive>
        ${dollarProfit} (+{percentProfit}%)
      </ProfitPositive>
    );
  } else {
    return (
      <ProfitNegative>
        ${dollarProfit} ({percentProfit}%)
      </ProfitNegative>
    );
  }
};

export const computeBreakevenPercent = (
  straddleUSD: string,
  ethUSD: number
): string => {
  const straddle = parseFloat(straddleUSD);
  const upper = ((ethUSD + straddle) / ethUSD) * 100 - 100;
  return upper.toFixed(1);
};
