import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { STETHDepositHelper, STETHDepositHelper__factory } from "../codegen";
import {
  STETHDepositHelperAddress,
  EarnSTETHDepositHelperAddress,
  VaultVersion,
} from "../constants/constants";
import useWeb3Wallet from "./useWeb3Wallet";
import { useWeb3Context } from "./web3Context";

export const getSTETHDepositHelper = (
  vaultVersion: VaultVersion,
  library: any
) => {
  const depositHelperAddress =
    vaultVersion === "earn"
      ? EarnSTETHDepositHelperAddress
      : STETHDepositHelperAddress;
  if (library) {
    const provider = library.getSigner();
    return STETHDepositHelper__factory.connect(depositHelperAddress, provider);
  }

  return undefined;
};

const useSTETHDepositHelper = (vaultVersion: VaultVersion) => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [depositHelper, setDepositHelper] = useState<STETHDepositHelper>();

  useEffect(() => {
    const helper = getSTETHDepositHelper(vaultVersion, provider || defaultProvider);
    setDepositHelper(helper);
  }, [active, defaultProvider, provider, vaultVersion]);

  return depositHelper;
};
export default useSTETHDepositHelper;
