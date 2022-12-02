import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { STETHDepositHelper, STETHDepositHelper__factory } from "../codegen";
import {
  STETHDepositHelperAddress,
  EarnSTETHDepositHelperAddress,
  VaultVersion,
} from "../constants/constants";

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
  const { library, active } = useWeb3React();
  const [depositHelper, setDepositHelper] = useState<STETHDepositHelper>();

  useEffect(() => {
    const helper = getSTETHDepositHelper(vaultVersion, library);
    setDepositHelper(helper);
  }, [active, library, vaultVersion]);

  return depositHelper;
};
export default useSTETHDepositHelper;
