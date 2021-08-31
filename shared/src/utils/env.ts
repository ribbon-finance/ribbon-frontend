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

export const getV2SubgraphURI = () =>
  (isDevelopment()
    ? process.env.REACT_APP_KOVAN_V2_SUBGRAPHQL_URL
    : process.env.REACT_APP_V2_SUBGRAPHQL_URL) ||
  "https://api.thegraph.com/subgraphs/name/ribbon-finance/ribbon-v2-kovan";

export const getDefaultNetworkName = () =>
  isDevelopment() ? "kovan" : "mainnet";

export const getDefaultChainID = () => (isDevelopment() ? 42 : 1);
