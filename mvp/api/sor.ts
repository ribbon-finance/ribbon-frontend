import { NowRequest, NowResponse } from "@vercel/node";
import { BigNumber } from "ethers";

type VenueName = "HEGIC" | "OPYN_GAMMA";

type OptionType = 1 | 2;

type TradeRequest = {
  expiry: number;
  spotPrice: number;
  buyAmount: number;
};

type Trade = {
  venues: VenueName[];
  optionTypes: OptionType[];
  amounts: BigNumber[];
  strikePrices: BigNumber[];
  buyData: string[];
  gasPrice: BigNumber[];
  value: BigNumber;
};

// export default (request: NowRequest, response: NowResponse) => {
//   const { expiry, buyAmount } = request.query;

//   const tradeRequest = {
//     expiry: parseInt(expiry as string),
//     spotPrice: 100,
//     buyAmount: parseFloat(buyAmount as string),
//   };

//   response.status(200).send(`Hello ${name}!`);
// };

export default (request: NowRequest, response: NowResponse) => {
  response.status(200).send(`Hello world!`);
};

function getBestTrade(tradeRequest: TradeRequest) {}
