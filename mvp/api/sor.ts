import { NowRequest, NowResponse } from "@vercel/node";
import { TradeRequest } from "../src/api/types";
import { getBestTrade } from "../src/api/sor";

export default async (request: NowRequest, response: NowResponse) => {
  const { buyAmount, spotPrice } = request.query;

  try {
    validateRequest(request, response);
  } catch (e) {
    console.error(e);
    return;
  }

  const tradeRequest: TradeRequest = {
    spotPrice: spotPrice as string,
    buyAmount: buyAmount as string,
  };

  const tradeResponse = await getBestTrade(tradeRequest);

  response.status(200).json(tradeResponse);

  return;
};

function validateRequest(request: NowRequest, response: NowResponse) {
  const { spotPrice, buyAmount } = request.query;
  const valid =
    !isNaN(parseInt(buyAmount as string)) &&
    !isNaN(parseInt(spotPrice as string));

  if (!valid) {
    response.status(400).send("Invalid request");
    throw new Error("Invalid request");
  }
}
