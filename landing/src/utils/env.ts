export const isDevelopment = () => process.env.NODE_ENV === "development";

export const getNodeURI = () =>
  isDevelopment()
    ? process.env.REACT_APP_TESTNET_URI
    : process.env.REACT_APP_MAINNET_URI;

export const getDefaultNetworkName = () =>
  isDevelopment() ? "kovan" : "mainnet";

export const getDefaultChainID = () => 42;
