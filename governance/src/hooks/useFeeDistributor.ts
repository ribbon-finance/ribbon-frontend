import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { FeeDistributorAddress } from "shared/lib/constants/constants";
import { FeeDistributor, FeeDistributor__factory } from "shared/lib/codegen";

export const getFeeDistributor = (library: any): FeeDistributor | undefined => {
  if (library) {
    const provider = library.getSigner();
    return FeeDistributor__factory.connect(FeeDistributorAddress, provider);
  }

  return undefined;
};

const useFeeDistributor = (): FeeDistributor | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<FeeDistributor>();

  useEffect(() => {
    setContract(getFeeDistributor(library));
  }, [library, active]);

  return contract;
};

export default useFeeDistributor;
