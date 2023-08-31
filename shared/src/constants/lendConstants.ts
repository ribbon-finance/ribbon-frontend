import { Assets } from "../store/types";
import { CHAINID } from "../constants/constants";
import deployment from "./lendDeployments.json";
import { NETWORK_NAMES } from "./constants";

export const NETWORKS: Record<number, NETWORK_NAMES> = {
  [CHAINID.ETH_MAINNET]: "mainnet",
};

export const PoolVersionList = ["lend"] as const;
export type PoolVersion = typeof PoolVersionList[number];

export const EVMPoolList = ["wintermute", "folkvang"] as const;

const AllPoolOptions = [...EVMPoolList];

export type PoolOptions = typeof AllPoolOptions[number];

// @ts-ignore
export const PoolList: PoolOptions[] = EVMPoolList;

export const PoolAddressMap: {
  [pool in PoolOptions]: {
    lend: string;
    chainId: number;
  };
} = {
  wintermute: {
    lend: deployment.mainnet.wintermute,
    chainId: CHAINID.ETH_MAINNET,
  },
  folkvang: {
    lend: deployment.mainnet.folkvang,
    chainId: CHAINID.ETH_MAINNET,
  },
};

export const getAssets = (pool: PoolOptions): Assets => {
  return "USDC";
};

export const getCredoraName = (pool: PoolOptions): string => {
  switch (pool) {
    case "wintermute":
      return "Wintermute Trading Ltd";
    case "folkvang":
      return "Folkvang";
  }
};

export const getDisplayAssets = (pool: PoolOptions): Assets => {
  return "USDC";
};
