import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";

import { calculateBoostMultiplier } from "./math";

/**
 * For V1 vault that does not use yield-token as collateral,
 * we simply take the latest auction close yield to interpolate the APY
 */
it("Result from calculate boost should match expected result", () => {
  const multiplier1 = calculateBoostMultiplier({
    workingBalance: BigNumber.from("0"),
    workingSupply: parseUnits("90750379.15850782", 18),
    gaugeBalance: parseUnits("1", 18),
    poolLiquidity: parseUnits("10000000000", 18),
    veRBNAmount: parseUnits("0.01", 18),
    totalVeRBN: parseUnits("1000000000", 18),
  });
  const multiplier2 = calculateBoostMultiplier({
    workingBalance: BigNumber.from("0"),
    workingSupply: parseUnits("90750379.15850782", 18),
    gaugeBalance: parseUnits("1", 18),
    poolLiquidity: parseUnits("1000000000", 18),
    veRBNAmount: parseUnits("123.4", 18),
    totalVeRBN: parseUnits("10000000000000", 18),
  });
  const multiplier3 = calculateBoostMultiplier({
    workingBalance: BigNumber.from("0"),
    workingSupply: parseUnits("90750379.15850782", 18),
    gaugeBalance: parseUnits("1", 18),
    poolLiquidity: parseUnits("1000000000", 18),
    veRBNAmount: parseUnits("123.4", 18),
    totalVeRBN: parseUnits("100000000000", 18),
  });
  expect(Number(multiplier1.toFixed(2))).toEqual(1.15);
  expect(Number(multiplier2.toFixed(2))).toEqual(1.02);
  expect(Number(multiplier3.toFixed(2))).toEqual(2.5);
});

it("Max boost should be 2.5x", () => {
  // A large veRBN amount should result in max boost
  const veRBNAmount = parseUnits("10000000000000000", 18);

  const multiplier = calculateBoostMultiplier({
    workingBalance: BigNumber.from("0"),
    workingSupply: parseUnits("90750379.15850782", 18),
    gaugeBalance: parseUnits("1", 18),
    poolLiquidity: parseUnits("10000000000", 18),
    veRBNAmount,
    totalVeRBN: parseUnits("100000000000", 18),
  });
  expect(Number(multiplier.toFixed(2))).toEqual(2.5);
});

it("Min boost should be 1x", () => {
  // A small veRBN amount should result in min boost
  const veRBNAmount = parseUnits("0.0000001", 18);

  const multiplier = calculateBoostMultiplier({
    workingBalance: BigNumber.from("0"),
    workingSupply: parseUnits("90750379.15850782", 18),
    gaugeBalance: parseUnits("1", 18),
    poolLiquidity: parseUnits("10000000000", 18),
    veRBNAmount,
    totalVeRBN: parseUnits("100000000000", 18),
  });
  expect(Number(multiplier.toFixed(2))).toEqual(1);
});
