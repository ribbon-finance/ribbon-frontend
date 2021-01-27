import { BigNumber, ethers } from "ethers";
import { InstrumentPosition } from "../models";

export const sumPortfolioValue = (positions: InstrumentPosition[]) => {
  const positionSum = positions.reduce(
    (accum: BigNumber, pos: InstrumentPosition) => accum.add(pos.pnl),
    BigNumber.from("0")
  );
  return parseFloat(ethers.utils.formatEther(positionSum));
};

export const venueKeyToName = (venueKey: string) => {
  const dict: Record<string, string> = {
    OPYN_GAMMA: "Opyn V2",
    HEGIC: "Hegic",
    "": "Unknown",
  };
  return dict[venueKey];
};
