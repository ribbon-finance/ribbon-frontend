import { useEffect, useState } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import deployments from "shared/lib/constants/v1Deployments.json";
import { isDevelopment } from "shared/lib/utils/env";
import { MerkleDistributorFactory } from "shared/lib/codegen/MerkleDistributorFactory";
import { MerkleDistributor } from "shared/lib/codegen";

export const getMerkleDistributor = (
  ethereumProvider: any
): MerkleDistributor | undefined => {
  if (ethereumProvider) {
    const provider = ethereumProvider.getSigner();
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
  const { ethereumProvider, active } = useWeb3Wallet();
  const [contract, setContract] = useState<MerkleDistributor>();

  useEffect(() => {
    setContract(getMerkleDistributor(ethereumProvider));
  }, [ethereumProvider, active]);

  return contract;
};

export default useMerkleDistributor;
