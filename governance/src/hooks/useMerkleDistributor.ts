import { useEffect, useState } from "react";
import { useWeb3Wallet } from "shared/lib/hooks/useWeb3Wallet";

import {
  MerkleDistributorAdjustable,
  MerkleDistributorAdjustable__factory,
} from "shared/lib/codegen";
import deployments from "shared/lib/constants/v1Deployments.json";
import { isProduction } from "shared/lib/utils/env";

export const getMerkleDistributor = (
  ethereumProvider: any,
  isMissedMerkleProof: boolean
): MerkleDistributorAdjustable | undefined => {
  if (ethereumProvider) {
    const provider = ethereumProvider.getSigner();
    return MerkleDistributorAdjustable__factory.connect(
      isProduction()
        ? isMissedMerkleProof
          ? deployments.mainnet.MerkleDistributorStakingAirdrop2
          : deployments.mainnet.MerkleDistributorStakingAirdrop
        : deployments.sepolia.MerkleDistributorStakingAirdrop,
      provider
    );
  }

  return undefined;
};

const useMerkleDistributor = () => {
  const { ethereumProvider, active } = useWeb3Wallet();
  const [contract, setContract] = useState<MerkleDistributorAdjustable>();
  const [contract2, setContract2] = useState<MerkleDistributorAdjustable>();

  useEffect(() => {
    setContract(getMerkleDistributor(ethereumProvider, false));
    setContract2(getMerkleDistributor(ethereumProvider, true));
  }, [ethereumProvider, active]);

  return {
    contract,
    contract2,
  };
};

export default useMerkleDistributor;
