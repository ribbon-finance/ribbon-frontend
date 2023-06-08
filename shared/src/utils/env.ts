import { Network } from "@zetamarkets/flex-sdk";
import SolanaDeployments from "../constants/solanaDeployments.json";

export enum CHAINID {
  ETH_MAINNET = 1,
  ETH_KOVAN = 42,
  AVAX_FUJI = 43113,
  AVAX_MAINNET = 43114,
  BINANCE_MAINNET = 56,
}

export const SUBGRAPH_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]:
    process.env.REACT_APP_V2_SUBGRAPHQL_URL ||
    "https://api.goldsky.com/api/public/project_clch40o0v0d510huoey7g5yaz/subgraphs/ribbon-v2/prod/gn",
  [CHAINID.ETH_KOVAN]:
    process.env.REACT_APP_KOVAN_V2_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2-kovan",
  [CHAINID.AVAX_FUJI]:
    process.env.REACT_APP_FUJI_SUBGRAPHQL_URL ||
    "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-avax",
  [CHAINID.AVAX_MAINNET]:
    process.env.REACT_APP_AVAX_SUBGRAPHQL_URL ||
    "https://api.goldsky.com/api/public/project_clch40o0v0d510huoey7g5yaz/subgraphs/ribbon-avax/prod/gn",
  [CHAINID.BINANCE_MAINNET]:
    process.env.REACT_APP_BINANCE_SUBGRAPHQL_URL ||
    "https://api.goldsky.com/api/public/project_clch40o0v0d510huoey7g5yaz/subgraphs/ribbon-binance/prod/gn",
};

export const SOLANA_SUBGRAPH = "https://ribbon-solana.hasura.app/v1/graphql";

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

// we use treasury for now
export const isVIP = () =>
  process.env.REACT_APP_VAULT_COLLECTION === "treasury";

export const NODE_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]: process.env.REACT_APP_MAINNET_URI || "",
  [CHAINID.ETH_KOVAN]: process.env.REACT_APP_TESTNET_URI || "",
  [CHAINID.AVAX_MAINNET]: process.env.REACT_APP_AVAX_URI || "",
  [CHAINID.AVAX_FUJI]: process.env.REACT_APP_FUJI_URI || "",
  [CHAINID.BINANCE_MAINNET]: process.env.REACT_APP_BINANCE_URI || "",
};

export const getSolanaClusterURI: () => string = () =>
  isDevelopment()
    ? process.env.REACT_APP_SOLANA_TESTNET_URI ||
      "https://api.devnet.solana.com"
    : process.env.REACT_APP_SOLANA_MAINNET_URI ||
      "https://solana-api.projectserum.com";

export const getSolanaAddresses = () =>
  isDevelopment() ? SolanaDeployments.devnet : SolanaDeployments.mainnet;

export const getSolanaNetwork = () =>
  isDevelopment() ? Network.DEVNET : Network.MAINNET;

export const getSubgraphqlURI = () =>
  (isDevelopment()
    ? process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL
    : process.env.REACT_APP_SUBGRAPHQL_URL) ||
  "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan";

export const getSubgraphqlRearnURI = () =>
  process.env.REACT_APP_SUBGRAPHQL_REARN_URL ||
  "https://api.studio.thegraph.com/query/30834/ribbonearnvault/v0.0.2";

export const supportedChainIds = isDevelopment()
  ? [CHAINID.ETH_KOVAN, CHAINID.AVAX_FUJI]
  : [CHAINID.ETH_MAINNET, CHAINID.AVAX_MAINNET, CHAINID.BINANCE_MAINNET];

/**
 * Multi chain env configs
 */

export const ENABLED_CHAINID: CHAINID[] = [
  CHAINID.ETH_MAINNET,
  CHAINID.AVAX_MAINNET,
  CHAINID.BINANCE_MAINNET,
];

export const isChainIdEnabled = (chainId: number) =>
  ENABLED_CHAINID.includes(chainId);

export const getENSSubgraphURI = () =>
  isDevelopment()
    ? ""
    : process.env.REACT_APP_ENS_SUBGRAPHQL_URL ||
      "https://api.goldsky.com/api/public/project_clch40o0v0d510huoey7g5yaz/subgraphs/ribbon-ens/prod/gn";

export const getGovernanceSubgraphURI = () =>
  isDevelopment()
    ? "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-governance-kovan"
    : process.env.REACT_APP_GOVERNANCE_SUBGRAPHQL_URL ||
      "https://api.goldsky.com/api/public/project_clch40o0v0d510huoey7g5yaz/subgraphs/ribbon-governance/prod/gn";

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
