import { NextApiRequest, NextApiResponse } from "next";
import {
  getwstETHRatio,
  getrETHRatio,
  getClosestBlock,
  getsAVAXRatio,
} from "./_onchain";
import { parseExpiryFromRequest } from "./_utils";
import axios from "axios";
import {
  PYTH_ASSET_TO_PRICE_FEED_ID,
  PYTH_PRICE_FEED_ID_TO_ASSET,
} from "./constants";

export interface FeedResponse {
  publishTime: string;
  symbol: string;
  price: number;
  confidence: number;
}

async function fetchPythPrices(timestamp: number): Promise<any> {
  try {
    const queryString = Object.values(PYTH_ASSET_TO_PRICE_FEED_ID)
      .map((id) => `ids=${id}`)
      .join("&");
    const url = `https://benchmarks.pyth.network/v1/updates/price/${timestamp}?${queryString}`;
    const startTime = Date.now();
    const response = await axios.get(url, {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    });
    const endTime = Date.now();

    const elapsedTime = endTime - startTime;
    console.log(`Time taken for pyth request: ${elapsedTime}ms`);
    return response.data.parsed;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const expiryTimestamp = parseExpiryFromRequest(request);
  let text = "asset,expiry_price\n";
  const closestBlockNumberEthereum = await getClosestBlock(
    expiryTimestamp,
    "ethereum"
  );
  const closestBlockNumberAvax = await getClosestBlock(expiryTimestamp, "avax");

  console.log(
    `Block used for exchange rates: 
    Ethereum: ${closestBlockNumberEthereum.toString()}
    Avax: ${closestBlockNumberAvax.toString()}`
  );

  const priceRatioPromises = [
    getwstETHRatio(closestBlockNumberEthereum),
    getrETHRatio(closestBlockNumberEthereum),
    getsAVAXRatio(closestBlockNumberAvax),
  ];
  const [wstETHPriceRatio, rETHPriceRatio, sAVAXPriceRatio] = await Promise.all(
    priceRatioPromises
  );

  console.log("wsteth ratio: ", wstETHPriceRatio);
  console.log("reth ratio: ", rETHPriceRatio);
  console.log("savax ratio: ", sAVAXPriceRatio);

  const assetPrices = await fetchPythPrices(expiryTimestamp);
  let ethPrice = null;
  let avaxPrice = null;

  for (const {
    id,
    price: { price, expo },
  } of assetPrices) {
    const asset = PYTH_PRICE_FEED_ID_TO_ASSET[id];
    const formattedPrice = (
      parseFloat(price) /
      10 ** Math.abs(parseInt(expo))
    ).toFixed(8);

    text += `${asset},${formattedPrice}\n`;

    if (asset === "ETH") ethPrice = formattedPrice;
    if (asset === "AVAX") avaxPrice = formattedPrice;
  }

  if (ethPrice) {
    const wstETHPrice = (parseFloat(ethPrice!) * wstETHPriceRatio).toFixed(8);
    const rETHPrice = (parseFloat(ethPrice!) * rETHPriceRatio).toFixed(8);
    text += `wstETH,${wstETHPrice}\nrETH,${rETHPrice}\n`;
  }
  if (avaxPrice) {
    const sAVAXPrice = (parseFloat(avaxPrice!) * sAVAXPriceRatio).toFixed(8);
    text += `sAVAX,${sAVAXPrice}\n`;
  }
  response.setHeader("content-type", "text/plain");

  response.status(200).send(text);
}
