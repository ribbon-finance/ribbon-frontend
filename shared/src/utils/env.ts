export enum CHAINID {
  ETH_MAINNET = 1,
  ETH_KOVAN = 42,
  AVAX_FUJI = 43113,
  AVAX_MAINNET = 43114,
  AURORA_MAINNET = 1313161554,
  AURORA_TESTNET = 1313161555,
}

export const SUBGRAPH_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]:
    process.env.REACT_APP_V2_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2",
  [CHAINID.ETH_KOVAN]:
    process.env.REACT_APP_KOVAN_V2_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2-kovan",
  [CHAINID.AVAX_FUJI]:
    process.env.REACT_APP_FUJI_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-avax",
  [CHAINID.AVAX_MAINNET]:
    process.env.REACT_APP_AVAX_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-avax",
  [CHAINID.AURORA_MAINNET]:
    process.env.REACT_APP_AVAX_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-aurora",
};

// We just default to staging by default
export const isDevelopment = () => !isStaging() && !isProduction();

// We use the same environment for development and staging
// But we still need a switch to only show dev features locally
export const isStaging = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "staging";

export const isProduction = () =>
  process.env.REACT_APP_VERCEL_GIT_COMMIT_REF === "master";

export const isTreasury = () =>
  process.env.REACT_APP_VAULT_COLLECTION === "treasury";

export const NODE_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_URI || "",
  [CHAINID.ETH_KOVAN]: process.env.REACT_APP_TESTNET_URI || "",
  [CHAINID.AVAX_MAINNET]: process.env.REACT_APP_AVAX_URI || "",
  [CHAINID.AVAX_FUJI]: process.env.REACT_APP_FUJI_URI || "",
  [CHAINID.AURORA_MAINNET]: process.env.REACT_APP_AURORA_URI || "",
  [CHAINID.AURORA_MAINNET]: "https://testnet.aurora.dev/",
};

export const getSubgraphqlURI = () =>
  (isDevelopment()
    ? process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL
    : process.env.REACT_APP_SUBGRAPHQL_URL) ||
  "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan";

export const supportedChainIds = isDevelopment()
  ? [CHAINID.ETH_KOVAN, CHAINID.AVAX_FUJI, CHAINID.AURORA_MAINNET]
  : [CHAINID.ETH_MAINNET, CHAINID.AVAX_MAINNET, CHAINID.AURORA_MAINNET];

/**
 * Multi chain env configs
 */

// TODO: Remove the isProduction check when enabling avalanche
export const ENABLED_CHAINID: CHAINID[] = [
  CHAINID.ETH_MAINNET,
  CHAINID.AVAX_MAINNET,
  CHAINID.AURORA_MAINNET,
];

export const isChainIdEnabled = (chainId: number) =>
  ENABLED_CHAINID.includes(chainId);

export const getENSSubgraphURI = () =>
  isDevelopment()
    ? ""
    : process.env.REACT_APP_ENS_SUBGRAPHQL_URL ||
      "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

export const getGovernanceSubgraphURI = () =>
  isDevelopment()
    ? "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-governance-kovan"
    : process.env.REACT_APP_GOVERNANCE_SUBGRAPHQL_URL ||
      "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-governance";

const STAKING_ENABLED_CHAINID: CHAINID[] = [CHAINID.ETH_MAINNET];

export const isStakingEnabledForChainId = (chainId: number | undefined) =>
  chainId && Boolean(STAKING_ENABLED_CHAINID.includes(chainId));

const EtherscanApi = process.env.REACT_APP_ETHERSCAN_API_KEY || "";
const SnowTraceApi = process.env.REACT_APP_SNOWTRACE_API_KEY || "";
export const GAS_URL: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${EtherscanApi}`,
  [CHAINID.ETH_KOVAN]: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${EtherscanApi}`,
  [CHAINID.AVAX_FUJI]: `https://api.snowtrace.io/api?module=gastracker&action=gasoracle&apikey=${SnowTraceApi}`,
  [CHAINID.AVAX_MAINNET]: `https://api.snowtrace.io/api?module=gastracker&action=gasoracle&apikey=${SnowTraceApi}`,
};
