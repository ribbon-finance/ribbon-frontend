import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { STETHDepositHelper, STETHDepositHelper__factory } from "../codegen";
import { STETHDepositHelperAddress } from "../constants/constants";

export const getSTETHDepositHelper = (library: any) => {
  if (library) {
    const provider = library.getSigner();
    return STETHDepositHelper__factory.connect(
      STETHDepositHelperAddress,
      provider
    );
  }

  return undefined;
};

const useSTETHDepositHelper = () => {
  const { library, active } = useWeb3React();
  const [depositHelper, setDepositHelper] = useState<STETHDepositHelper>();

  useEffect(() => {
    const helper = getSTETHDepositHelper(library);
    setDepositHelper(helper);
  }, [active, library]);

  return depositHelper;
};
export default useSTETHDepositHelper;
