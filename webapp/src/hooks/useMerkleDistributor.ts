import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import deployments from "shared/lib/constants/deployments.json";
import { isDevelopment } from "shared/lib/utils/env";
import { MerkleDistributorFactory } from "shared/lib/codegen/MerkleDistributorFactory";
import { MerkleDistributor } from "shared/lib/codegen";


export const getMerkleDistributor = (
  library: any
): MerkleDistributor | undefined => {
  if (library) {
    const provider = library.getSigner();
    return MerkleDistributorFactory.connect(
      isDevelopment()
        ? deployments.kovan.MerkleDistributor
        : deployments.mainnet.MerkleDistributor,
      provider
    );
  }

  return undefined;
};

const useMerkleDistributor = (): MerkleDistributor | undefined => {
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<MerkleDistributor>();

  useEffect(() => {
    setContract(getMerkleDistributor(library));
  }, [library, active]);

  return contract;
};

export default useMerkleDistributor;
