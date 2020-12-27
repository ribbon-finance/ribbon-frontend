import { BigNumber, ethers } from "ethers";

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
