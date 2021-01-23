import { BigNumber, ethers } from "ethers";
import { InstrumentPosition } from "../models";

export const sumPortfolioValue = (positions: InstrumentPosition[]) => {
  const positionSum = positions.reduce(
    (accum: BigNumber, pos: InstrumentPosition) => accum.add(pos.pnl),
    BigNumber.from("0")
  );
  return parseFloat(ethers.utils.formatEther(positionSum));
};
