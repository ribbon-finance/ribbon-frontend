import { Chains } from "../constants/constants";

const EVMChains: Chains[] = [Chains.Ethereum, Chains.Avalanche];

export const isEVMChain = (chain: Chains): boolean => {
  return EVMChains.includes(chain);
};

export const isSolanaChain = (chain: Chains): boolean =>
  chain === Chains.Solana;
