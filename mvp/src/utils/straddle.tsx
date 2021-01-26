import { BigNumber, ethers } from "ethers";
import styled from "styled-components";
import { wadToUSD } from "./math";

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
  totalPremium: BigNumber,
  ethPrice: number
): [string, string] => {
  const straddleCost = parseFloat(ethers.utils.formatEther(totalPremium));
  return [(straddleCost * ethPrice).toFixed(2), straddleCost.toFixed(3)];
};

export const computeBreakeven = (
  straddleUSD: string,
  callStrikePrice: BigNumber,
  putStrikePrice: BigNumber
): [number, number] => {
  const scaleFactor = BigNumber.from("10").pow(BigNumber.from("16"));
  const straddle = parseFloat(straddleUSD);
  const putStrikeNum = putStrikePrice.div(scaleFactor).toNumber() / 100;
  const callStrikeNum = callStrikePrice.div(scaleFactor).toNumber() / 100;

  const lower = putStrikeNum - straddle;
  const upper = callStrikeNum + straddle;
  return [lower, upper];
};

export const computeDefaultPrice = (upperBreakeven: number, buffer: number) => {
  const defaultPrice = upperBreakeven * buffer;
  return Math.round(defaultPrice);
};

export const computeGainsAmount = (
  currentAssetPrice: number,
  futureAssetPrice: number,
  callStrikePrice: BigNumber,
  putStrikePrice: BigNumber,
  instrumentPrice: number,
  amount: number
): [string, string, boolean] => {
  if (isNaN(futureAssetPrice)) {
    return ["0.00", "0.0", true];
  }

  const callStrikeNum = wadToUSD(callStrikePrice);
  const putStrikeNum = wadToUSD(putStrikePrice);

  let dollarProfit = 0;

  if (futureAssetPrice > callStrikeNum) {
    dollarProfit =
      (futureAssetPrice - callStrikeNum - instrumentPrice) * amount;
  } else if (futureAssetPrice < putStrikeNum) {
    dollarProfit = (putStrikeNum - futureAssetPrice - instrumentPrice) * amount;
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
  callStrikePrice: BigNumber,
  putStrikePrice: BigNumber,
  ethUSD: number
) => {
  const [lower, upper] = computeBreakeven(
    straddleUSD,
    callStrikePrice,
    putStrikePrice
  );

  const straddle = parseFloat(straddleUSD);
  const upperBreakeven = ((upper + straddle) / ethUSD) * 100 - 100;
  const lowerBreakeven = ((lower - straddle) / ethUSD) * 100;

  const minBreakeven = Math.min(upperBreakeven, lowerBreakeven);
  return minBreakeven.toFixed(1);
};

// export const computeBreakevenPercent = (
//   straddleUSD: string,
//   ethUSD: number
// ): string => {
//   const straddle = parseFloat(straddleUSD);
//   const upper = ((ethUSD + straddle) / ethUSD) * 100 - 100;
//   return upper.toFixed(1);
// };
