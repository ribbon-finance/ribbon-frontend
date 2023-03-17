import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { CurveFeeDistributionAddress } from "shared/lib/constants/constants";
import { CurveFeeDistribution } from "shared/lib/codegen/CurveFeeDistribution";
import { CurveFeeDistribution__factory } from "shared/lib/codegen/factories/CurveFeeDistribution__factory";
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
  const { library, active } = useWeb3React();
  const [contract, setContract] = useState<CurveFeeDistribution>();

  useEffect(() => {
    setContract(getCurveFeeDistribution(library));
  }, [library, active]);

  return contract;
};

export default useCurveFeeDistribution;
