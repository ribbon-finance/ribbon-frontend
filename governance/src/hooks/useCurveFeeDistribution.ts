import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { CurveFeeDistributionAddress } from "shared/lib/constants/constants";
import { CurveFeeDistribution } from "shared/lib/codegen/CurveFeeDistribution";
import { CurveFeeDistribution__factory } from "shared/lib/codegen/factories/CurveFeeDistribution__factory";
import useWeb3Wallet from "shared/lib/hooks/useWeb3Wallet";
import { useWeb3Context } from "shared/lib/hooks/web3Context";
export const getCurveFeeDistribution = (
  library: any,
  useSigner: boolean = true
): CurveFeeDistribution | undefined => {
  const provider = useSigner ? library.getSigner() : library;
  return CurveFeeDistribution__factory.connect(
    CurveFeeDistributionAddress,
    provider
  );
};

const useCurveFeeDistribution = (): CurveFeeDistribution | undefined => {
  const { provider } = useWeb3React();
  const { active } = useWeb3Wallet();
  const { provider: defaultProvider } = useWeb3Context();
  const [contract, setContract] = useState<CurveFeeDistribution>();

  useEffect(() => {
    setContract(getCurveFeeDistribution(provider || defaultProvider));
  }, [active, provider, defaultProvider]);

  return contract;
};

export default useCurveFeeDistribution;
