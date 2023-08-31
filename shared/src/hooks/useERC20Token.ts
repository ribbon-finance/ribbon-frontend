import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ERC20Token } from "../models/eth";
import { useWeb3Context } from "./web3Context";
import { IERC20__factory } from "../codegen/factories/IERC20__factory";
import { IERC20 } from "../codegen";
import { getERC20TokenAddress } from "../constants/constants";
import useWeb3Wallet from "./useWeb3Wallet";

export const getERC20Token = (
  library: any,
  token: ERC20Token,
  chainId: number,
  useSigner: boolean = true
) => {
  const address = getERC20TokenAddress(token, chainId);
  if (library && address) {
    const provider = useSigner ? library.getSigner() : library;
    return IERC20__factory.connect(address, provider);
  }
  return undefined;
};

const useERC20Token = (token: ERC20Token) => {
  const { chainId, provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<IERC20>();

  useEffect(() => {
    if (provider && chainId) {
      setContract(
        getERC20Token(provider || defaultProvider, token, chainId, active)
      );
    }
  }, [chainId, provider, active, token, defaultProvider]);

  return contract;
};
export default useERC20Token;
