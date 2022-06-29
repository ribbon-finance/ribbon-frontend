import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { CurveLidoPool, CurveLidoPool__factory } from "../codegen";
import { STETHDepositHelperAddress } from "../constants/constants";

export const getSTETHDepositHelper = (library: any) => {
  if (library) {
    const provider = library.getSigner();
    // TODO: - Change to steth deposit helper
    return CurveLidoPool__factory.connect(STETHDepositHelperAddress, provider);
  }

  return undefined;
};

const useSTETHDepositHelper = () => {
  const { library, active } = useWeb3React();
  // TODO: - Change to deposit helper type
  const [depositHelper, setDepositHelper] = useState<CurveLidoPool>();

  useEffect(() => {
    const pool = getSTETHDepositHelper(library);
    setDepositHelper(pool);
  }, [active, library]);

  return depositHelper;
};
export default useSTETHDepositHelper;
