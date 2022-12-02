export enum CHAINID {
  ETH_MAINNET = 1,
}

export const SUBGRAPH_URI: Record<number, string> = {
  [CHAINID.ETH_MAINNET]:
    process.env.REACT_APP_SUBGRAPHQL_URL ||
    "https://api.studio.thegraph.com/query/30834/ribbonlend/v1.0",
};

export const getSubgraphqlURI = () =>
  process.env.REACT_APP_SUBGRAPHQL_URL ||
  "https://api.studio.thegraph.com/query/30834/ribbonlend/v1.0";

export const supportedChainIds = [CHAINID.ETH_MAINNET];

export const ENABLED_CHAINID: CHAINID[] = [CHAINID.ETH_MAINNET];

export const isChainIdEnabled = (chainId: number) =>
  ENABLED_CHAINID.includes(chainId);
