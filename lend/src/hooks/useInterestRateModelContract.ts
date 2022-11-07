import { InterestRateModel__factory } from "../codegen/factories/InterestRateModel__factory";
import deployment from "../constants/deployments.json";

export const getInterestRateModelContract = (library: any) => {
  const provider = library;

  return InterestRateModel__factory.connect(
    deployment.mainnet.cosinemodel,
    provider
  );
};

export default getInterestRateModelContract;
