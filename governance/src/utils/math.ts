import { BigNumber } from "@ethersproject/bignumber";
import { Duration } from "moment";

export const calculateInitialveRBNAmount = (
  rbnAmount: BigNumber,
  duration: Duration
) => {
  const totalHours = Math.round(duration.asHours());
  const hoursInTwoYears = 365 * 2 * 24;
  const veRbnAmount = rbnAmount
    .mul(BigNumber.from(totalHours))
    .div(BigNumber.from(hoursInTwoYears));
  return veRbnAmount.isNegative() ? BigNumber.from(0) : veRbnAmount;
};
