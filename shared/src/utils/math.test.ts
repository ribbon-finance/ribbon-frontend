import { BigNumber } from "@ethersproject/bignumber";
import { providers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { LiquidityGaugeControllerFactory } from "../codegen/LiquidityGaugeControllerFactory";

import {
  calculateBaseRewards,
  calculateBoostedRewards,
  calculateBoostMultiplier,
  calculateClaimableRbn,
} from "./governanceMath";

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

it("Boosted rewards should be correct", () => {
  const boostedRewards0 = calculateBoostedRewards(0, 1.7);
  const boostedRewards1 = calculateBoostedRewards(10, 1.5);
  const boostedRewards2 = calculateBoostedRewards(20, 2.5);
  const boostedRewards3 = calculateBoostedRewards(40, 1.04);

  expect(boostedRewards0.toFixed(2)).toEqual("0.00");
  expect(boostedRewards1.toFixed(2)).toEqual("5.00");
  expect(boostedRewards2.toFixed(2)).toEqual("30.00");
  expect(boostedRewards3.toFixed(2)).toEqual("1.60");
});

it("Base rewards should be correct", () => {
  const baseRewards0 = calculateBaseRewards({
    poolSize: BigNumber.from("111000000000000000"),
    poolReward: BigNumber.from("118780129032258064346046"),
    pricePerShare: BigNumber.from("1000000000000000000"),
    decimals: 18,
    assetPrice: 2568.91135996858,
    rbnPrice: 1.3238686374851516,
  });
  const baseRewards1 = calculateBaseRewards({
    poolSize: BigNumber.from("111000000000000000"),
    poolReward: BigNumber.from("11878012903225806434"),
    pricePerShare: BigNumber.from("1000000000000000000"),
    decimals: 18,
    assetPrice: 2568.91135996858,
    rbnPrice: 1.3238686374851516,
  });
  expect(baseRewards0.toFixed(2)).toEqual("3.978424792019947e+144");
  expect(baseRewards1.toFixed(2)).toEqual("1528.87");
});

it("Should calculate claimable RBN amount", async () => {
  const controllerContract = LiquidityGaugeControllerFactory.connect(
    "0x1897D25dc65406F0a534cb6749010b3EdD9f87D9",
    new providers.AlchemyProvider("kovan", "qtBrk7Td-rz5trQucLDn7tyY9nyNt9Ao")
  );
  // const result = await calculateClaimableRbn({
  //   periodTimestamp: 1645611644,
  //   integrateInvSupply: BigNumber.from("756825236148384688349460"),
  //   integrateFraction: BigNumber.from("24137357007092246788726"),
  //   integrateInvSupplyOf: BigNumber.from("756825236148384688349460"),
  //   futureEpochTime: 1645923256,
  //   inflation_rate: BigNumber.from("761033399470899470"),
  //   minterRate: BigNumber.from("761033399470899470"),
  //   isKilled: false,
  //   workingSupply: BigNumber.from("44928461131414151"),
  //   workingBalance: BigNumber.from("28928461131414151"),
  //   mintedRBN: BigNumber.from("6170583036185114560390"),
  //   gaugeContractAddress: "0xaC4495454a564731C085a5fcc522dA1F0Bdd69d4",
  //   gaugeControllerContract: controllerContract
  // })
  const result = await calculateClaimableRbn({
    periodTimestamp: 1645611644,
    integrateInvSupply: BigNumber.from("756825236148384688349460"),
    integrateFraction: BigNumber.from("2767682163702311463282"),
    integrateInvSupplyOf: BigNumber.from("140218215759955115497677"),
    futureEpochTime: 1645923256,
    inflation_rate: BigNumber.from("761033399470899470"),
    minterRate: BigNumber.from("761033399470899470"),
    isKilled: false,
    workingSupply: BigNumber.from("44928461131414151"),
    workingBalance: BigNumber.from("16000000000000000"),
    mintedRBN: BigNumber.from("2648373947544176317057"),
    gaugeContractAddress: "0xaC4495454a564731C085a5fcc522dA1F0Bdd69d4",
    gaugeControllerContract: controllerContract,
  });
  console.log("RESULT: ", result.toString());
}, 100000);
