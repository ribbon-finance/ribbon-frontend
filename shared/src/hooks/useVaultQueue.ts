import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useWeb3Context } from "./web3Context";
import useV2VaultContract from "./useV2VaultContract";
import useTokenAllowance from "./useTokenAllowance";
import v2deployment from "./../constants/v2Deployments.json";
import { VaultQueue } from "../codegen";
import { VaultQueueFactory } from "../codegen/VaultQueueFactory";
import { VaultQueueAddress, TransferType } from "../constants/constants";

export const getVaultQueueContract = (
  library: any,
  chainId: number,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return VaultQueueFactory.connect(
    (VaultQueueAddress as any)[chainId],
    provider
  );
};

const useVaultQueue = (vaultOption: any) => {
  const { account, active, chainId, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const v2Vault = useV2VaultContract(vaultOption);
  const tokenAllowance =
    useTokenAllowance(
      `${vaultOption}-v2` as any,
      (VaultQueueAddress as any)[chainId!]
    ) || BigNumber.from(0);

  const [vaultQueue, setVaultQueue] = useState<VaultQueue | null>(null);

  useEffect(() => {
    if (chainId) {
      const vaultQueue = getVaultQueueContract(
        library || provider,
        chainId,
        active
      );
      setVaultQueue(vaultQueue);
    }
  }, [active, chainId, library, provider]);

  const queueTransfer = async () => {
    if (!v2Vault || !account) {
      return;
    }

    let vaultBalance = await v2Vault.balanceOf(account);
    if (tokenAllowance.gt(vaultBalance)) {
      await v2Vault.maxRedeem();
      vaultBalance = await v2Vault.balanceOf(account);
    }

    if (vaultBalance.gt(tokenAllowance)) {
      await v2Vault.approve(VaultQueueAddress[chainId!], vaultBalance);
    }

    let dstVault;
    switch (vaultOption) {
      case "rAVAX-THETA":
        dstVault = v2deployment.avax.RibbonThetaVaultSAVAXCall;
        break;
      case "rETH-THETA":
        dstVault = v2deployment.mainnet.RibbonThetaVaultSTETHCall;
        break;
      default:
        throw Error("Unknown dstVault");
    }

    try {
      await vaultQueue!.queueTransfer(
        v2Vault.address,
        dstVault,
        dstVault,
        TransferType.TRANSFER,
        vaultBalance.toString()
      );
    } catch (e: any) {
      console.log("queueTransfer failed", e); // eslint-disable-line
    }
  };

  const queueWithdrawal = async (amount: BigNumber) => {
    if (!v2Vault || !account) {
      return;
    }

    const vaultBalance = await v2Vault.balanceOf(account);
    if (amount.gt(vaultBalance)) {
      await v2Vault.maxRedeem();
    }

    if (amount.gt(tokenAllowance)) {
      await v2Vault.approve(VaultQueueAddress[chainId!], amount);
    }

    const res = await vaultQueue!.queueTransfer(
      v2Vault.address,
      account!,
      account!,
      TransferType.WITHDRAWAL,
      amount.toString()
    );

    return res;
  };

  return [tokenAllowance, queueTransfer, queueWithdrawal, vaultQueue];
};

export default useVaultQueue;
