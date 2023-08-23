import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  getDisplayAssets,
  VaultAddressMap,
  VaultOptions,
} from "../constants/constants";
import { getAssetColor } from "./asset";
import { Connection, PublicKey } from "@solana/web3.js";
import { Vault, vaultTypes, vaultUtils } from "@zetamarkets/flex-sdk";
import * as spl from "@solana/spl-token";

export const isVaultFull = (
  deposits: BigNumber,
  cap: BigNumber,
  decimals: number
) => {
  const margin = parseUnits("0.01", decimals);
  return !cap.isZero() && deposits.gte(cap.sub(margin));
};

export const isVaultSupportedOnChain = (
  vaultOption: VaultOptions,
  chainId: number
): Boolean => {
  return VaultAddressMap[vaultOption].chainId === chainId;
};

export const isETHVault = (vault: VaultOptions) =>
  ["rETH-THETA", "rstETH-THETA"].includes(vault);

export const getVaultColor = (vault: VaultOptions) =>
  getAssetColor(getDisplayAssets(vault));

// earn outer ring feColorMatrix value
export const getEarnVaultFeColorMatrix = (vault: VaultOptions) => {
  const displayAsset = getDisplayAssets(vault);
  switch (displayAsset) {
    case "USDC":
      return "0 0 0 0 0.243137 0 0 0 0 0.45098 0 0 0 0 0.768627 0 0 0 0.25 0";
    case "stETH":
      return "0 0 0 0 0.243137 0 0 0 0 0.45098 0 0 0 0 0.768627 0 0 0 0.25 0";
    case "WBTC":
      return "";
    default:
      return "0 0 0 0 0.0862745 0 0 0 0 0.807843 0 0 0 0 0.72549 0 0 0 0.25 0";
  }
};

/*** SOLANA-ONLY UTILS ***/
export const isEqualsToUserAddress = (
  userKey: PublicKey,
  nodeKey: PublicKey
): boolean => {
  return userKey?.equals(nodeKey);
};

export const getUserDepositQueueAmount = (
  vault: vaultTypes.Vault,
  userKey: PublicKey
): BigNumber => {
  const depositNodes = vault.depositQueue.filter((node) =>
    node.info.userKey.equals(userKey)
  );

  return depositNodes.reduce(
    (acc, node) => acc.add(BigNumber.from(node.info.amount.toNumber())),
    BigNumber.from(0)
  );
};

export const getUserWithdrawQueueAmount = (
  vault: vaultTypes.Vault,
  userKey: PublicKey
): BigNumber => {
  const withdrawalNodes = vault.withdrawalQueue.filter((node) =>
    node.info.userKey.equals(userKey)
  );

  return withdrawalNodes.reduce(
    (acc, node) => acc.add(BigNumber.from(node.info.amount.toNumber())),
    BigNumber.from(0)
  );
};

export const getSOLPricePerShare = async (): Promise<number> => {
  const connection = new Connection(
    process.env.REACT_APP_SOLANA_MAINNET_URI || ""
  );
  const vaultAddress = vaultUtils.getVaultAddress("rSOL-THETA")[0];
  const vaultInfo = Vault.getVault(vaultAddress);
  const vaultUnderlyingTokenAccount = await spl.AccountLayout(
    connection,
    vaultInfo.vaultUnderlyingTokenAccount
  );

  let totalBalance = Number(vaultUnderlyingTokenAccount.amount);

  // If the option is initialized, we know that a portion of the vault balance is in the option collateral.
  if (vaultInfo.option !== null) {
    const optionVault = await spl.AccountLayout(
      connection,
      vaultInfo.option.vault
    );
    totalBalance += Number(optionVault.amount);
  }

  const redeemableMint = await spl.MintLayout(
    connection,
    vaultInfo.redeemableMint
  );

  // Price per share = total vault balance / redeemable mint supply
  const pricePerShare = totalBalance / Number(redeemableMint.supply);

  return pricePerShare;
};

export const getSOLAmountByShares = async (
  amount: number,
  decimals: number
): Promise<number> => {
  const pricePerShare = await getSOLPricePerShare();
  return Math.floor(
    (Number(amount) / Number(pricePerShare)) * Math.pow(10, decimals)
  );
};
