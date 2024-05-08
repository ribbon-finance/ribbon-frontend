import { useEffect, useState } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import {
  MerkleDistributorAdjustable,
  MerkleDistributorAdjustable__factory,
} from "shared/lib/codegen";
import deployments from "shared/lib/constants/v1Deployments.json";
import { isProduction } from "shared/lib/utils/env";

export const getMerkleDistributor = (
  ethereumProvider: any
): MerkleDistributorAdjustable | undefined => {
  if (ethereumProvider) {
    const provider = ethereumProvider.getSigner();
    return MerkleDistributorAdjustable__factory.connect(
      isProduction()
        ? deployments.mainnet.MerkleDistributorStakingAirdrop
        : deployments.sepolia.MerkleDistributorStakingAirdrop,
      provider
    );
  }

  return undefined;
};

const useMerkleDistributor = (): MerkleDistributorAdjustable | undefined => {
  const { ethereumProvider, active } = useWeb3Wallet();
  const [contract, setContract] = useState<MerkleDistributorAdjustable>();

  useEffect(() => {
    setContract(getMerkleDistributor(ethereumProvider));
  }, [ethereumProvider, active]);

  return contract;
};

export default useMerkleDistributor;
