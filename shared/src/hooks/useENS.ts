import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { CHAINID } from "../utils/env";

const useENS = (address: string) => {
  const { library, chainId } = useWeb3React();
  const [ensName, setENSName] = useState<string | null>(null);

  useEffect(() => {
    const resolveENS = async () => {
      if (chainId === CHAINID.ETH_MAINNET && ethers.utils.isAddress(address)) {
        let ensName = await library.lookupAddress(address);
        if (ensName) setENSName(ensName);
      }
    };
    resolveENS();
  }, [address]);

  return { ensName };
};

export default useENS;
