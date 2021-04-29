import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { IERC20, IERC20__factory } from "../codegen";
import { isStaging } from "../utils/env";
import addresses from "../constants/externalAddresses.json";
import { ERC20Token } from "../models/eth";

export const getERC20Token = (library: any, token: ERC20Token) => {
  if (library) {
    const provider = library.getSigner();

    return IERC20__factory.connect(
      isStaging()
        ? addresses.kovan.assets[token]
        : addresses.mainnet.assets[token],
      provider
    );
  }

  return undefined;
};

const useERC20Token = (token: ERC20Token) => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<IERC20>();

  useEffect(() => {
    if (active && library) {
      setContract(getERC20Token(library, token));
    }
  }, [library, active, token]);

  return contract;
};
export default useERC20Token;
