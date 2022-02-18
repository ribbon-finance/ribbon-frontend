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
  userKey: PublicKey
): Promise<BigNumber> => {
  const depositNodes = vault.depositQueue.filter((node) =>
    node.info.userKey.equals(userKey)
  );

  return depositNodes.reduce(
    (acc, node) => acc.add(BigNumber.from(node.info.amount.toString())),
    BigNumber.from(0)
  );
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
  userKey: PublicKey
): Promise<BigNumber> => {
  const withdrawalNodes = vault.withdrawalQueue.filter((node) =>
    node.info.userKey.equals(userKey)
  );

  return withdrawalNodes.reduce(
    (acc, node) => acc.add(BigNumber.from(node.info.amount.toString())),
    BigNumber.from(0)
  );
};
