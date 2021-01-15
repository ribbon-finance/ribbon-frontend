import { BigNumber } from "ethers";
import { TradeRequest, TradeResponse } from "./types";
import axios from "axios";

export async function getBestTrade(
  tradeRequest: TradeRequest
): Promise<TradeResponse> {
  const otokenAddress = "0x78A36417C9f3814AE1B4367D03bfF6AC6fd631FB";
  const apiResponse = await get0xQuote(otokenAddress, BigNumber.from("100000"));

  return {
    venues: [],
    optionTypes: [],
    amounts: [],
    strikePrices: [],
    buyData: [],
    gasPrice: [],
    value: BigNumber.from("0").toString(),
  };
}

const ZERO_EX_API_URI = "https://api.0x.org/swap/v1/quote";

async function get0xQuote(otokenAddress: string, buyAmount: BigNumber) {
  const data: Record<string, string> = {
    buyToken: otokenAddress,
    sellToken: "USDC",
    buyAmount: buyAmount.toString(),
  };
  const query = new URLSearchParams(data).toString();
  const url = `${ZERO_EX_API_URI}?${query}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
