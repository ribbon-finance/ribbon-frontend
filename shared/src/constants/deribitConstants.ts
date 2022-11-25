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

export const isAltcoin = (asset: Asset) => !isListedOnDeribit(asset)