import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { LendPoolHelper } from "../codegen";
import { LendPoolHelper__factory } from "../codegen/factories/LendPoolHelper__factory";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
import deployment from "../constants/deployments.json";

export const getLendPoolContract = (
  library: any,
  useSigner: boolean = true
) => {
  const provider = useSigner ? library.getSigner() : library;

  return LendPoolHelper__factory.connect(
    deployment.mainnet.lendpoolhelper,
    provider
  );
};

const useLendPoolHelperContract = () => {
  const { active, library } = useWeb3React();
  const { provider } = useWeb3Context();
  const [poolFactory, setPoolFactory] = useState<LendPoolHelper | null>(null);

  useEffect(() => {
    const poolFactory = getLendPoolContract(library || provider, active);
    setPoolFactory(poolFactory);
  }, [active, library, provider]);

  return poolFactory;
};
export default useLendPoolHelperContract;
