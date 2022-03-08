import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { CallOverrides } from "@ethersproject/contracts";
import { parseUnits } from "ethers/lib/utils";
import { LiquidityGaugeController } from "../codegen/LiquidityGaugeController";

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
  expect(baseRewards0.toFixed(2)).toEqual("2867600.59");
  expect(baseRewards1.toFixed(2)).toEqual("286.67");
});

it("Should calculate claimable RBN amount", async () => {
  class MockGaugeController {
    "gauge_relative_weight(address,uint256)"(
      addr: string,
      time: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber> {
      return Promise.resolve(BigNumber.from("258064516129032258"));
    }
  }

  const mockContract = new MockGaugeController() as LiquidityGaugeController;
  const result = await calculateClaimableRbn({
    currentDate: new Date(1645764677297),
    periodTimestamp: 1645677264,
    integrateInvSupply: BigNumber.from("901203333833025818578828"),
    integrateFraction: BigNumber.from("28313754145663697906898"),
    integrateInvSupplyOf: BigNumber.from("901203333833025818578828"),
    futureEpochTime: 1645923256,
    inflation_rate: BigNumber.from("761033399470899470"),
    minterRate: BigNumber.from("761033399470899470"),
    isKilled: false,
    workingSupply: BigNumber.from("44911094102448064"),
    workingBalance: BigNumber.from("28911094102448064"),
    mintedRBN: BigNumber.from("28313754145663697906898"),
    gaugeContractAddress: "0xaC4495454a564731C085a5fcc522dA1F0Bdd69d4",
    gaugeControllerContract: mockContract,
  });

  // 9985 $RBN
  expect(result.toString()).toEqual("11051441462736454437032");
  // console.log("RESULT: ", result.toString());
}, 100000);
