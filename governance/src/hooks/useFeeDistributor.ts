import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { FeeDistributorAddress } from "shared/lib/constants/constants";
import { FeeDistributor, FeeDistributor__factory } from "shared/lib/codegen";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { useWeb3Context } from "shared/lib/hooks/web3Context";

export const getFeeDistributor = (library: any): FeeDistributor | undefined => {
  if (library) {
    const provider = library.getSigner();
    return FeeDistributor__factory.connect(FeeDistributorAddress, provider);
  }

  return undefined;
};

const useFeeDistributor = (): FeeDistributor | undefined => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<FeeDistributor>();

  useEffect(() => {
    setContract(getFeeDistributor(provider || defaultProvider));
  }, [active, provider, defaultProvider]);

  return contract;
};

export default useFeeDistributor;
