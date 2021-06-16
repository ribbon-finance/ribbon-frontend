import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { IERC20, IERC20__factory } from "../codegen";
import { isDevelopment } from "../utils/env";
import addresses from "../constants/externalAddresses.json";
import { ERC20Token } from "../models/eth";
import { useWeb3Context } from "./web3Context";

export const getERC20Token = (
  library: any,
  token: ERC20Token,
  useSigner: boolean = true
) => {
  if (library) {
    const provider = useSigner ? library.getSigner() : library;

    return IERC20__factory.connect(
      isDevelopment()
        ? addresses.kovan.assets[token]
        : addresses.mainnet.assets[token],
      provider
    );
  }

  return undefined;
};

const useERC20Token = (token: ERC20Token) => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<IERC20>();

  useEffect(() => {
    if (provider) {
      setContract(getERC20Token(library || provider, token, active));
    }
  }, [provider, active, library, token]);

  return contract;
};
export default useERC20Token;
