import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  getDisplayAssets,
  VaultAddressMap,
  VaultOptions,
} from "../constants/constants";
import { getAssetColor } from "./asset";
import { PublicKey } from "@solana/web3.js";
import { vaultTypes } from "@zetamarkets/flex-sdk";
import * as anchor from "@project-serum/anchor";

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

/*** SOLANA-ONLY UTILS ***/
export const isEqualsToUserAddress = (
  userKey: PublicKey,
  nodeKey: PublicKey
): boolean => {
  return userKey?.equals(nodeKey);
};

export const getUserDepositQueueNodes = (
  vault: vaultTypes.Vault,
  userKey: PublicKey
): PublicKey[] => {
  const depositQueueNodes: PublicKey[] = [];

  if (vault) {
    vault.depositQueue.forEach((deposit) => {
      if (
        deposit?.info?.userKey &&
        isEqualsToUserAddress(userKey, deposit.info.userKey)
      ) {
        depositQueueNodes.push(deposit.address);
      }
    });
  }

  return depositQueueNodes;
};

export const getUserDepositQueueAmount = async (
  vault: vaultTypes.Vault,
  connection: anchor.web3.Connection,
  userKey: PublicKey
): Promise<BigNumber> => {
  const depositQueueNodes = getUserDepositQueueNodes(vault, userKey);
  const totalDeposits = await Promise.all(
    depositQueueNodes.map((node) => connection.getBalance(node))
  );

  return BigNumber.from(totalDeposits.reduce((val, acc) => (acc += val), 0));
};

export const getUserWithdrawQueueNodes = (
  vault: vaultTypes.Vault,
  userKey: PublicKey
): PublicKey[] => {
  const withdrawQueueNodes: PublicKey[] = [];

  if (vault) {
    vault.withdrawalQueue.forEach((withdraw) => {
      if (
        withdraw?.info?.userKey &&
        isEqualsToUserAddress(userKey, withdraw.info.userKey)
      ) {
        withdrawQueueNodes.push(withdraw.address);
      }
    });
  }

  return withdrawQueueNodes;
};

export const getUserWithdrawQueueAmount = async (
  vault: vaultTypes.Vault,
  connection: anchor.web3.Connection,
  userKey: PublicKey
): Promise<BigNumber> => {
  const withdrawQueueNodes = getUserWithdrawQueueNodes(vault, userKey);
  const totalWithdrawal = await Promise.all(
    withdrawQueueNodes.map((node) => connection.getBalance(node))
  );

  return BigNumber.from(totalWithdrawal.reduce((val, acc) => (acc += val), 0));
};
