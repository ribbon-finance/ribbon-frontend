import { Chains } from "../constants/constants";

const EVMChains: Chains[] = [Chains.Ethereum];

export const isEVMChain = (chain: Chains): boolean => {
  return EVMChains.includes(chain);
};
