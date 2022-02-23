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
  const totalHours = Math.round(duration.asHours());
  const hoursInTwoYears = 365 * 2 * 24;
  const veRbnAmount = rbnAmount
    .mul(BigNumber.from(totalHours))
    .div(BigNumber.from(hoursInTwoYears));
  return veRbnAmount.isNegative() ? BigNumber.from(0) : veRbnAmount;
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
    ? ((1 + poolRewardInUSD / poolSizeInUSD) ** 52 - 1) * 100
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
  periodTimestamp: number; // period timestamp of current period, LG5.period_timestamp[period]
  integrate_inv_supply: BigNumber; // integrate_inv_supply of the current period, LG5.integrate_inv_supply[period]
  integrate_fraction: BigNumber; // LG5.integrate_fraction[addr]
  integrate_inv_supply_of: BigNumber; // LG5.integrate_inv_supply_of[addr]
  future_epoch_time: number; // LG5.future_epoch_time
  inflation_rate: BigNumber; // LG5.inflation_rate
  minterRate: BigNumber; // MinterContract.rate
  isKilled: boolean; // LG5.is_killed
  working_supply: BigNumber; // LG5.working_suppply
  working_balance: BigNumber; // LG5.working_balances[addr]
  mintedRBN: BigNumber; // amount of RBN minted. From MinterContract.minted[account][gauge]
  gaugeContractAddress: string;
  gaugeControllerContract: LiquidityGaugeController;
}

export const calculateClaimableRbn = async ({
  periodTimestamp,
  integrate_inv_supply,
  integrate_fraction,
  integrate_inv_supply_of,
  future_epoch_time,
  inflation_rate,
  minterRate,
  isKilled,
  working_supply,
  working_balance,
  mintedRBN,
  gaugeContractAddress,
  gaugeControllerContract,
}: ClaimableRbnCalculationProps) => {
  const WEEK = 604800;
  const currentTime = Math.round(Date.now() / 1000);

  const trimDecimals = (number: number) => {
    return Number(number.toFixed(0));
  };

  let _integrate_inv_supply = integrate_inv_supply;
  let rate = inflation_rate;
  let new_rate = rate;
  const prev_future_epoch = future_epoch_time;

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

      console.log({
        gauge: gaugeContractAddress,
        relativeWeightTime: trimDecimals(prev_week_time / WEEK) * WEEK,
        w: w.toString(),
      });

      if (working_supply.gt(0)) {
        if (
          prev_future_epoch >= prev_week_time &&
          prev_future_epoch < week_time &&
          rate !== new_rate
        ) {
          _integrate_inv_supply = _integrate_inv_supply.add(
            rate
              .mul(w)
              .mul(prev_future_epoch - prev_week_time)
              .div(working_supply)
          );
          rate = new_rate;
          _integrate_inv_supply = _integrate_inv_supply.add(
            rate
              .mul(w)
              .mul(week_time - prev_future_epoch)
              .div(working_supply)
          );
        } else {
          _integrate_inv_supply = _integrate_inv_supply.add(
            new_rate.mul(w).mul(dt).div(working_supply)
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

  // Update user - specific integrals
  // _working_balance: uint256 = self.working_balances[addr]
  // self.integrate_fraction[addr] += _working_balance * (_integrate_inv_supply - self.integrate_inv_supply_of[addr]) / 10 ** 18
  // self.integrate_inv_supply_of[addr] = _integrate_inv_supply
  // self.integrate_checkpoint_of[addr] = block.timestamp
  console.log("invSupp", _integrate_inv_supply.toString());
  integrate_fraction = integrate_fraction.add(
    working_balance
      .mul(integrate_inv_supply.sub(integrate_inv_supply_of))
      .div(parseUnits("1", 18))
  );
  console.log("intr", integrate_fraction.toString());
  const totalMint = integrate_fraction.add(
    working_balance
      .mul(integrate_inv_supply.sub(integrate_inv_supply_of))
      .div(parseUnits("1", 18))
  );
  return totalMint.sub(mintedRBN);
};
