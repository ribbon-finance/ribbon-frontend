import { BigNumber } from "@ethersproject/bignumber";
import { Duration } from "moment";

export const calculateInitialveRBNAmount = (
  rbnAmount: BigNumber,
  duration: Duration
) => {
  const totalDays = duration.asDays();
  const daysInFourYears = 365 * 4;

  return rbnAmount
    .mul(BigNumber.from(totalDays))
    .div(BigNumber.from(daysInFourYears));
};
