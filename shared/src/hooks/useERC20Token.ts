import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ERC20Token } from "../models/eth";
import { useWeb3Context } from "./web3Context";
import { IERC20Factory } from "../codegen/IERC20Factory";
import { IERC20 } from "../codegen";
import { getERC20TokenAddress } from "../constants/constants";

export const getERC20Token = (
  library: any,
  token: ERC20Token,
  chainId: number,
  useSigner: boolean = true
) => {
  const address = getERC20TokenAddress(token, chainId);
  if (library && address) {
    const provider = useSigner ? library.getSigner() : library;
    return IERC20Factory.connect(address, provider);
  }
  return undefined;
};

const useERC20Token = (token: ERC20Token) => {
  const { active, chainId, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [contract, setContract] = useState<IERC20>();

  useEffect(() => {
    if (provider && chainId) {
      setContract(getERC20Token(library || provider, token, chainId, active));
    }
  }, [chainId, provider, active, library, token]);

  return contract;
};
export default useERC20Token;
