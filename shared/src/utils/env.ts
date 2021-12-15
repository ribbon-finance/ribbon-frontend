export enum CHAINID {
  ETH_MAINNET = 1,
  ETH_KOVAN = 42,
  AVAX_FUJI = 43113,
  AVAX_MAINNET = 43114,
}

export const FALLBACK_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2-kovan";
export const SUBGRAPH_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]:
    process.env.REACT_APP_V2_SUBGRAPHQL_URL || FALLBACK_SUBGRAPH_URL,
  [CHAINID.ETH_KOVAN]:
    process.env.REACT_APP_KOVAN_V2_SUBGRAPHQL_URL || FALLBACK_SUBGRAPH_URL,
  [CHAINID.AVAX_FUJI]:
    process.env.REACT_APP_FUJI_SUBGRAPHQL_URL || FALLBACK_SUBGRAPH_URL,
  [CHAINID.AVAX_MAINNET]:
    process.env.REACT_APP_AVAX_SUBGRAPHQL_URL || FALLBACK_SUBGRAPH_URL,
};

// We just default to staging by default
export const isDevelopment = () => !isStaging() && !isProduction();

// We use the same environment for development and staging
// But we still need a switch to only show dev features locally
export const isStaging = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "staging";

export const isProduction = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "master";
export const getNodeURI = () =>
  isDevelopment()
    ? process.env.REACT_APP_TESTNET_URI
    : process.env.REACT_APP_MAINNET_URI;

export const getSubgraphqlURI = () =>
  (isDevelopment()
    ? process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL
    : process.env.REACT_APP_SUBGRAPHQL_URL) ||
  "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan";

/**
 * Multi chain env configs
 */

// TODO: Remove the isProduction check when enabling avalanche
export const ENABLED_CHAINID: CHAINID[] = isProduction()
  ? [CHAINID.ETH_MAINNET]
  : [CHAINID.ETH_MAINNET, CHAINID.AVAX_MAINNET];

const STAKING_ENABLED_CHAINID: CHAINID[] = [CHAINID.ETH_MAINNET];

export const isStakingEnabledForChainId = (chainId: number | undefined) =>
  chainId && Boolean(STAKING_ENABLED_CHAINID.includes(chainId));
