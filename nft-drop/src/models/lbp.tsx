import { BigNumber } from "ethers";

export type LBPPoolTransactionType = "buy" | "sell";

export interface LBPPoolTransaction {
  id: string;
  type: LBPPoolTransactionType;
  address: string;
  txhash: string;
  timestamp: number;
  /** Price should be in USDC per token */
  price: number;
  amount: BigNumber;
}

export interface LBPPoolData {
  spotPrice: BigNumber;
  ribbonSold: BigNumber;
  usdcRaised: BigNumber;
  swapFees: BigNumber;
}
