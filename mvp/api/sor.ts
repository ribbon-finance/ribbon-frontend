import { ethers } from "ethers";
import { NowRequest, NowResponse } from "@vercel/node";
import { TradeRequest } from "../src/api/types";
import { getBestTrade } from "../src/api/sor";

export default async (request: NowRequest, response: NowResponse) => {
  const { buyAmount, spotPrice, instrument } = request.query;

  try {
    validateRequest(request, response);
  } catch (e) {
    console.error(e);
    return;
  }

  const tradeRequest: TradeRequest = {
    spotPrice: spotPrice as string,
    buyAmount: buyAmount as string,
    instrument: ethers.utils.getAddress(instrument as string),
  };

  const tradeResponse = await getBestTrade(tradeRequest);

  // We use a static 1*10**18 buyAmount to query for the prices on the front page
  // if the buyAmount == 1*10**18 just return a longer cache age
  let freshWindow = 100;
  if (buyAmount === "1000000000000000000") {
    freshWindow = 3600;
  }

  const expiry = new Date(Date.now() + freshWindow * 1000).toUTCString();

  response.setHeader(
    "Cache-Control",
    `max-age=0, s-maxage=100, public, immutable, stale-while-revalidate`
  );
  response.setHeader("Expires", expiry);
  response.status(200).json(tradeResponse);

  return;
};

function validateRequest(request: NowRequest, response: NowResponse) {
  const { spotPrice, buyAmount, instrument } = request.query;
  const valid =
    !isNaN(parseInt(buyAmount as string)) &&
    !isNaN(parseInt(spotPrice as string)) &&
    typeof instrument === "string";

  if (!valid) {
    response.status(400).send("Invalid request");
    throw new Error("Invalid request");
  }
}
