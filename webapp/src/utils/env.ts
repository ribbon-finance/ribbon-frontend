// We just default to staging by default
export const isStaging = () =>
  process.env.REACT_APP_COMMIT_REF === "staging" ||
  process.env.REACT_APP_COMMIT_REF !== "master";

// We use the same environment for development and staging
// But we still need a switch to only show dev features locally
export const isDevelopment = () => isStaging();

export const getNodeURI = () =>
  isStaging()
    ? process.env.REACT_APP_TESTNET_URI
    : process.env.REACT_APP_MAINNET_URI;

export const getSubgraphqlURI = () => {
  return (
    (isStaging()
      ? process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL
      : process.env.REACT_APP_SUBGRAPHQL_URL) ||
    "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan"
  );
};

export const getDefaultNetworkName = () => (isStaging() ? "kovan" : "mainnet");

export const getDefaultChainID = () => (isStaging() ? 42 : 1);
