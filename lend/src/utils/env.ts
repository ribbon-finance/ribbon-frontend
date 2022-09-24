export enum CHAINID {
  ETH_MAINNET = 1,
}

export const SUBGRAPH_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]:
    process.env.REACT_APP_SUBGRAPHQL_URL ||
    "https://api.studio.thegraph.com/query/30834/ribbonlend/v1.0",
};

// We just default to staging by default
export const isDevelopment = () => !isStaging() && !isProduction();

// We use the same environment for development and staging
// But we still need a switch to only show dev features locally
export const isStaging = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "staging";

export const isProduction = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "master";

export const NODE_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_URI || "",
};

export const getSubgraphqlURI = () =>
  process.env.REACT_APP_SUBGRAPHQL_URL ||
  "https://api.studio.thegraph.com/query/30834/ribbonlend/v1.0";

export const supportedChainIds = [CHAINID.ETH_MAINNET];

/**
 * Multi chain env configs
 */

export const ENABLED_CHAINID: CHAINID[] = [CHAINID.ETH_MAINNET];

export const isChainIdEnabled = (chainId: number) =>
  ENABLED_CHAINID.includes(chainId);

const EtherscanApi = process.env.REACT_APP_ETHERSCAN_API_KEY || "";
export const GAS_URL: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${EtherscanApi}`,
};
