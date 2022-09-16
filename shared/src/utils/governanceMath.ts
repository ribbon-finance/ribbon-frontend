import { Duration } from "moment";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { assetToFiat } from "./math";
import { parseUnits } from "ethers/lib/utils";
import { LiquidityGaugeController } from "../codegen/LiquidityGaugeController";

const { formatUnits } = ethers.utils;

export const calculateInitialveRBNAmount = (
  rbnAmount: BigNumber,
  duration: Duration
) => {
  const totalMinutes = Math.round(duration.asMinutes());
  const minutesInTwoYears = 2 * 365 * 24 * 60;
  const veRbnAmount = rbnAmount
    .mul(BigNumber.from(totalMinutes))
    .div(BigNumber.from(minutesInTwoYears));
  return veRbnAmount.isNegative() ? BigNumber.from(0) : veRbnAmount;
};

export const calculateEarlyUnlockPenaltyPercentage = (
  remainingDuration: Duration
) => {
  const minutesRemaining = Math.round(remainingDuration.asMinutes());
  const minutesInTwoyears = 2 * 365 * 24 * 60;
  return Math.min(0.75, minutesRemaining / minutesInTwoyears);
};

export const calculateEarlyUnlockPenalty = (
  lockedAmount: BigNumber,
  remainingDuration: Duration
) => {
  const penaltyPercent =
    calculateEarlyUnlockPenaltyPercentage(remainingDuration);
  // Multiply and divide by 10,000 to preserve the accuracy, because BigNumber will remove
  // all decimals.
  // Eg. If penaltyPercent is 0.34, it will be 0 when converted to BigNumber
  // then lockedAmount.mul(0) will be 0.
  return lockedAmount.mul(Math.round(penaltyPercent * 10000)).div(10000);
};

interface BaseRewardsCalculationProps {
  poolSize: BigNumber;
  poolReward: BigNumber;
  pricePerShare: BigNumber;
  decimals: number;
  assetPrice: number;
  rbnPrice: number;
}

/**
 * Given pool size and rewards, calculate the base APY percentage
 * @param poolSize pool size (pool size should be larger than pool reward)
 * @param poolReward pool reward
 * @param pricePerShare price per share of the vault
 * @param decimals decimals of the vault
 * @param assetPrice price of the vault asset
 * @param rbnPrice Ribbon price
 * @returns APY percentage, eg. 40 (40%)
 */
export const calculateBaseRewards = ({
  poolSize,
  poolReward,
  pricePerShare,
  decimals,
  assetPrice,
  rbnPrice,
}: BaseRewardsCalculationProps) => {
  const poolRewardInUSD = parseFloat(assetToFiat(poolReward, rbnPrice));
  const poolSizeInAsset = poolSize
    .mul(pricePerShare)
    .div(parseUnits("1", decimals));
  const poolSizeInUSD = parseFloat(
    assetToFiat(poolSizeInAsset, assetPrice, decimals)
  );

  return poolSizeInUSD > 0
    ? // Not compounded
      (poolRewardInUSD / poolSizeInUSD) * 52 * 100
    : 0;
};

interface BoostMultiplierCalculationProps {
  // workingBalance and workingSupply is 18 decimals big number
  workingBalance: BigNumber;
  workingSupply: BigNumber;
  // gauge balance and pool liquidity is BigNumber, with the respective decimals
  // according to the underlying asset
  gaugeBalance: BigNumber;
  poolLiquidity: BigNumber;
  veRBNAmount: BigNumber;
  totalVeRBN: BigNumber;
}
// Calculates the boost for staking in vault gauges
export const calculateBoostMultiplier = ({
  workingBalance,
  workingSupply,
  gaugeBalance,
  poolLiquidity,
  veRBNAmount,
  totalVeRBN,
}: BoostMultiplierCalculationProps) => {
  let l = Number(gaugeBalance.toString());
  const L = Number(poolLiquidity.toString()) + l;
  const veRBNAmt = parseFloat(formatUnits(veRBNAmount, 18));
  const totalVeRBNAmt = parseFloat(formatUnits(totalVeRBN, 18));
  const workingBalanceAmt = Number(workingBalance.toString());
  const workingSupplyAmt = Number(workingSupply.toString());

  const TOKENLESS_PRODUCTION = 40;

  let lim = (l * TOKENLESS_PRODUCTION) / 100;
  lim +=
    (((L * veRBNAmt) / totalVeRBNAmt) * (100 - TOKENLESS_PRODUCTION)) / 100;
  lim = Math.min(l, lim);

  let old_bal = workingBalanceAmt;
  let noboost_lim = (TOKENLESS_PRODUCTION * l) / 100;
  let noboost_supply = workingSupplyAmt + noboost_lim - old_bal;
  let _working_supply = workingSupplyAmt + lim - old_bal;

  return lim / _working_supply / (noboost_lim / noboost_supply);
};

/**
 * Given the base rewards and multiplier, calculates the boosted rewards percentage
 * @param baseRewardsPercentage APY in percentage. Commonly the result from calculateBaseRewards(). eg. 10 (10%)
 * @param boostedMultiplier Multiplier. Commonly the result from calculateBoostMultiplier(). eg. 1.5 (1.5x)
 * @returns The boosted rewards percentage. eg. 5 (5%)
 */
export const calculateBoostedRewards = (
  baseRewardsPercentage: number,
  boostedMultiplier: number
) => {
  return boostedMultiplier > 0
    ? baseRewardsPercentage * boostedMultiplier - baseRewardsPercentage
    : 0;
};

interface ClaimableRbnCalculationProps {
  currentDate: Date;
  periodTimestamp: number; // period timestamp of current period, LG5.period_timestamp[period]
  integrateInvSupply: BigNumber; // integrate_inv_supply of the current period, LG5.integrate_inv_supply[period]
  integrateFraction: BigNumber; // LG5.integrate_fraction[addr]
  integrateInvSupplyOf: BigNumber; // LG5.integrate_inv_supply_of[addr]
  futureEpochTime: number; // LG5.future_epoch_time
  inflation_rate: BigNumber; // LG5.inflation_rate
  minterRate: BigNumber; // MinterContract.rate
  isKilled: boolean; // LG5.is_killed
  workingSupply: BigNumber; // LG5.working_suppply
  workingBalance: BigNumber; // LG5.working_balances[addr]
  mintedRBN: BigNumber; // amount of RBN minted. From MinterContract.minted[account][gauge]
  gaugeContractAddress: string;
  gaugeControllerContract: LiquidityGaugeController;
}

export const calculateClaimableRbn = async ({
  currentDate,
  periodTimestamp,
  integrateInvSupply,
  integrateFraction,
  integrateInvSupplyOf,
  futureEpochTime,
  inflation_rate,
  minterRate,
  isKilled,
  workingSupply,
  workingBalance,
  mintedRBN,
  gaugeContractAddress,
  gaugeControllerContract,
}: ClaimableRbnCalculationProps) => {
  const WEEK = 604800;
  const currentTime = Math.round(currentDate.getTime() / 1000);

  const trimDecimals = (number: number) => {
    return Number(number.toFixed(0));
  };

  let _integrate_inv_supply = integrateInvSupply;
  let rate = inflation_rate;
  let new_rate = rate;
  const prev_future_epoch = futureEpochTime;

  if (currentTime >= prev_future_epoch) {
    new_rate = minterRate;
  }

  if (isKilled) {
    // Stop distributing inflation as soon as killed
    rate = BigNumber.from(0);
    new_rate = BigNumber.from(0);
  }

  //  Update integral of 1 / supply
  if (currentTime > periodTimestamp) {
    let prev_week_time = periodTimestamp;
    let week_time = Math.min(
      trimDecimals((periodTimestamp + WEEK) / WEEK) * WEEK,
      currentTime
    );

    for (let i = 0; i < 500; i++) {
      const dt = week_time - prev_week_time;
      const w = await gaugeControllerContract[
        "gauge_relative_weight(address,uint256)"
      ](gaugeContractAddress, trimDecimals(prev_week_time / WEEK) * WEEK);

      if (workingSupply.gt(0)) {
        if (
          prev_future_epoch >= prev_week_time &&
          prev_future_epoch < week_time &&
          rate !== new_rate
        ) {
          _integrate_inv_supply = _integrate_inv_supply.add(
            rate
              .mul(w)
              .mul(prev_future_epoch - prev_week_time)
              .div(workingSupply)
          );
          rate = new_rate;
          _integrate_inv_supply = _integrate_inv_supply.add(
            rate
              .mul(w)
              .mul(week_time - prev_future_epoch)
              .div(workingSupply)
          );
        } else {
          _integrate_inv_supply = _integrate_inv_supply.add(
            new_rate.mul(w).mul(dt).div(workingSupply)
          );
          // On precisions of the calculation
          // rate ~= 10e18
          // last_weight > 0.01 * 1e18 = 1e16(if pool weight is 1 %)
          // _working_supply ~= TVL * 1e18 ~= 1e26($100M for example)
          // The largest loss is at dt = 1
          // Loss is 1e-9 - acceptable
        }
      }
      if (week_time === currentTime) {
        break;
      }
      prev_week_time = week_time;
      week_time = Math.min(week_time + WEEK, currentTime);
    }
  }
  integrateFraction = integrateFraction.add(
    workingBalance
      .mul(_integrate_inv_supply.sub(integrateInvSupplyOf))
      .div(parseUnits("1", 18))
  );
  return integrateFraction.sub(mintedRBN);
};
