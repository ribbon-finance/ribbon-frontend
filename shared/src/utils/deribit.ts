import { Moment } from "moment";
import axios from "axios";
import { get10dStrikeFromDeribit } from "./deribitMath";

export const ASSETS = ["SOL"];

export const LISTED_ON_DERIBIT = ["SOL"];

export type Asset = typeof ASSETS[number];

interface DeribitInstrumentDetails {
  result: {
    base_currency: string;
    greeks: {
      delta: number;
    };
    best_bid_price: number;
    underlying_price: number;
    bid_iv: number;
    mark_iv: number;
    strike: number;
    mark_price: number;
  };
}

export interface Option {
  asset: Asset;
  delta: number;
  bidPrice: number;
  bidPriceInUSD: number;
  strikePrice: number;
  bidIV: number;
  markIV: number;
  markPrice: number;
}

export async function getDeribitInstrumentDetails(
  instrumentName: string
): Promise<Option> {
  const url = `https://www.deribit.com/api/v2/public/ticker?instrument_name=${instrumentName}`;
  const response = await axios.get(url);
  const data: DeribitInstrumentDetails = response.data;

  const {
    greeks,
    best_bid_price: bidPrice,
    underlying_price,
    bid_iv,
    mark_iv,
    mark_price: markPrice,
  } = data.result;

  const [asset, , strikePrice] = instrumentName.split("-");

  return {
    delta: greeks.delta,
    bidPrice,
    bidPriceInUSD: bidPrice * underlying_price,
    strikePrice: parseInt(strikePrice),
    bidIV: bid_iv,
    markIV: mark_iv,
    asset,
    markPrice,
  };
}

interface DeribitInstrument {
  expiration_timestamp: number;
  strike: number;
  option_type: "call" | "put";
  is_active: boolean;
}

export const getStrikePricesForOption = async (
  assetName: Asset,
  expiry: Moment,
  isPut: boolean
) => {
  const url = `https://www.deribit.com/api/v2/public/get_instruments?currency=${assetName}&kind=option&expired=false`;
  const response = await axios.get(url);
  const instruments: DeribitInstrument[] = response.data.result;

  const expiryTimestampUs = Math.floor(expiry.utc().unix() * 1000);
  const matchingInstruments = instruments.filter(
    (i) =>
      i.expiration_timestamp === expiryTimestampUs &&
      (isPut ? i.option_type === "put" : i.option_type === "call") &&
      i.is_active
  );
  return matchingInstruments.map((i) => i.strike).sort();
};

export function getInstrumentName(
  assetName: Asset,
  expiry: Moment,
  strikePrice: number,
  isPut: boolean
) {
  const expiryStr = expiry.utc().format("DMMMYY").toUpperCase();
  return `${assetName}-${expiryStr}-${strikePrice}-${isPut ? "P" : "C"}`;
}

export async function getIndexPrice(asset: Asset) {
  const url = `https://www.deribit.com/api/v2/public/get_index_price?index_name=${asset.toLowerCase()}_usd`;
  const response = await axios.get(url);
  return response.data.result.index_price;
}

export async function getIndexPrices() {
  const responses = await Promise.all(
    LISTED_ON_DERIBIT.map((a) => getIndexPrice(a))
  );
  return Object.fromEntries(
    responses.map((r, ix) => [LISTED_ON_DERIBIT[ix], r])
  );
}

export type AssetOptions = Record<Asset, Record<number, Option>>;
