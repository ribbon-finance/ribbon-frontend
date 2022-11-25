import { VaultOptions } from "./constants";

export const ASSETS = [
  "BTC",
  "ETH",
  "AAVE",
  "APE",
  "AVAX",
  // "SAVAX",
  "SOL",
  "PERP",
  "BADGER",
  "BAL",
  "SPELL",
];

export const LISTED_ON_DERIBIT = ["BTC", "ETH"];

export type Asset = typeof ASSETS[number];

export const DERIBIT_STRIKE_OFFSETS: Record<Asset, number> = {
  BTC: 0.25,
  ETH: 0.3,
  SOL: 0.4,
};
export type Prices = Record<Asset, null | number>;

export const HAS_PUT_PRODUCTS: Record<Asset, boolean> = {
  BTC: false,
  ETH: true,
  SOL: true,
};

export const ROUNDING: Record<Asset, number> = {
  BTC: 500,
  ETH: 50,
  AAVE: 2.5,
  AVAX: 0.5,
  SAVAX: 0.5,
  APE: 0.5,
  SOL: 1,
};

export const isListedOnDeribit = (asset: Asset) =>
  LISTED_ON_DERIBIT.includes(asset);

export const isAltcoin = (asset: Asset) => !isListedOnDeribit(asset);
// get asset used in Deribit

export const getDeribitAssets = (vault: VaultOptions): string => {
  switch (vault) {
    case "rBTC-THETA":
      return "BTC";
    case "rETH-THETA":
    case "rUSDC-ETH-P-THETA":
    case "ryvUSDC-ETH-P-THETA":
    case "rstETH-THETA":
    case "rrETH-THETA":
      return "ETH";
    case "rAAVE-THETA":
      return "AAVE";
    case "rAVAX-THETA":
    case "rUSDC-AVAX-P-THETA":
      return "AVAX";
    case "rsAVAX-THETA":
      return "AVAX";
    case "rPERP-TSRY":
      return "PERP";
    case "rBAL-TSRY":
      return "BAL";
    case "rBADGER-TSRY":
      return "BADGER";
    case "rSPELL-TSRY":
      return "SPELL";
    case "rSOL-THETA":
      return "SOL";
    case "rAPE-THETA":
      return "APE";
    default:
      return "USDC";
  }
};
