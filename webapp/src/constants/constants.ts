import { isDevelopment } from "shared/lib/utils/env";
import {
  VaultNameOptionMap,
  VaultOptions,
  VaultVersion,
} from "shared/lib/constants/constants";
import { Airdrop, AirdropBreakdown, AirdropProof } from "../models/airdrop";
import ProofKovanData from "../data/proof-kovan.json";
import ProofData from "../data/proof.json";
import AirdropKovanData from "../data/airdrop-kovan.json";
import AirdropData from "../data/airdrop.json";
import BreakdownKovanData from "../data/breakdown-kovan.json";
import BreakdownData from "../data/breakdown.json";
import moment from "moment";

export const proof: AirdropProof = isDevelopment() ? ProofKovanData : ProofData;

export const airdrop: Airdrop = isDevelopment()
  ? AirdropKovanData
  : AirdropData;

export const breakdown: AirdropBreakdown = isDevelopment()
  ? BreakdownKovanData
  : BreakdownData;

export const getVaultURI = (
  vaultOption: VaultOptions,
  vaultVersion: VaultVersion = "v1"
): string => {
  switch (vaultVersion) {
    case "v1":
      return `/theta-vault/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
    case "v2":
      return `/v2/theta-vault/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
    case "earn":
      return `/earn/${
        Object.keys(VaultNameOptionMap)[
          Object.values(VaultNameOptionMap).indexOf(vaultOption)
        ]
      }`;
  }
};

const vaultFirstStrategyTime = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN":
      return moment.utc("2022-09-02").set("hour", 17);
    case "rEARN-stETH":
      return moment.utc("2022-12-09").set("hour", 17);
    default:
      return moment();
  }
};

export const useEarnStrategyTime = (vaultOption: VaultOptions): any => {
  let firstOpenLoanTime = vaultFirstStrategyTime(vaultOption);

  let strategyStartTime;

  while (!strategyStartTime) {
    let strategyStartTimeTemp = moment.duration(
      firstOpenLoanTime.diff(moment()),
      "milliseconds"
    );
    if (strategyStartTimeTemp.asMilliseconds() <= 0) {
      firstOpenLoanTime.add(7, "days");
    } else {
      strategyStartTime = strategyStartTimeTemp;
    }
  }

  return {
    strategyStartTime: `${strategyStartTime.days()}D ${strategyStartTime.hours()}H ${strategyStartTime.minutes()}M`,
    withdrawalDate: firstOpenLoanTime.format("Do MMM, YYYY"),
    depositWithdrawalDate: firstOpenLoanTime
      .add(7, "days")
      .format("Do MMM, YYYY"),
  };
};
