import { BigNumber } from "@ethersproject/bignumber";
import { Duration } from "moment";

export const calculateInitialveRBNAmount = (
  rbnAmount: BigNumber,
  duration: Duration
) => {
  const totalDays = duration.asDays();
  const daysInTwoYears = 365 * 2;

  return rbnAmount
    .mul(BigNumber.from(totalDays))
    .div(BigNumber.from(daysInTwoYears));
};
