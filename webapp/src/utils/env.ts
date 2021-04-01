export const isDevelopment = () => process.env.NODE_ENV === "development";

export const getNodeURI = () =>
  isDevelopment()
    ? process.env.REACT_APP_TESTNET_URI
    : process.env.REACT_APP_MAINNET_URI;

export const getSubgraphqlURI = () => {
  return (
    (isDevelopment()
      ? process.env.REACT_APP_KOVAN_SUBGRAPHQL_URL
      : process.env.REACT_APP_SUBGRAPHQL_URL) ||
    "https://api.thegraph.com/subgraphs/name/kenchangh/ribbon-finance-kovan"
  );
};

export const getDefaultNetworkName = () =>
  isDevelopment() ? "kovan" : "mainnet";

export const getDefaultChainID = () => 42;
