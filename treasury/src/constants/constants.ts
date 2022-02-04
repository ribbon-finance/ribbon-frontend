import { BigNumber, ethers } from "ethers";
import { TreasuryVaultList } from "shared/lib/constants/constants";

export type TreasuryVaultOptions = typeof TreasuryVaultList[number];

export const hashCode: {
  [vault in TreasuryVaultOptions]: string;
} = {
  "rPERP-TSRY":
    "0x86658217590fbd9edf0a68c0574d138a341d027a6c2d36c4c9021d0adb149df2",
};

export const minDeposit: { [vault in TreasuryVaultOptions]: BigNumber } = {
  "rPERP-TSRY": ethers.utils.parseEther("500"),
};
