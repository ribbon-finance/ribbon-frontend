export const DefiScoreTokenList = [
  "bat",
  "dai",
  "eth",
  "knc",
  "lend",
  "link",
  "mkr",
  "rep",
  "snx",
  "susd",
  "tusd",
  "usdc",
  "usdt",
  "wbtc",
  "zrx",
  "sol",
] as const;
export type DefiScoreToken = typeof DefiScoreTokenList[number];

const DefiScoreProtocolList = [
  "compound",
  "dydx",
  "ddex",
  "aave",
  "mcd",
] as const;
export type DefiScoreProtocol = typeof DefiScoreProtocolList[number];

export interface DefiScoreOpportunitiesResponse {
  data: Array<{
    aprHistory: Array<{
      date: number;
      value: string;
    }>;
    currentPrice: string;
    executeUrl: string;
    protocol: DefiScoreProtocol;
    risk: {
      centralizationIndex: number;
      centralizationRisk: number;
      collateralIndex: number;
      fourEngineeringWeeks: number;
      hasBugBounty: number;
      liquidityIndex: number;
      noCriticalVulns: number;
      operatingWithoutExploitSince: number;
      publicAudit: number;
      recentAuditOrNoCodeChanges: number;
      score: number;
      timeIndex: number;
    };
    supplyVolume: string;
    token: DefiScoreToken;
    trustFactors: {
      cons: Array<{
        text: string;
      }>;
      pros: Array<{
        text: string;
      }>;
    };
    tvl: string;
  }>;
}
