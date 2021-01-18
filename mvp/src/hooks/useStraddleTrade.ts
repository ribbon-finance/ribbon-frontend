import { BigNumber } from "ethers";
import axios from "axios";
import { Straddle, StraddleTrade, TradeResponse } from "../models";
import { useCallback, useEffect, useState } from "react";

const emptyTrade = {
  venues: [],
  amounts: [],
  totalPremium: BigNumber.from("0"),
  callPremium: BigNumber.from("0"),
  callStrikePrice: BigNumber.from("0"),
  putPremium: BigNumber.from("0"),
  putStrikePrice: BigNumber.from("0"),
  buyData: [],
  gasPrice: BigNumber.from("0"),
};

const SOR_API_URL = "/api/sor";

const scaleFactor = BigNumber.from("10").pow(BigNumber.from("16"));

export const useStraddleTrade = (
  instrumentAddress: string,
  spotPrice: number,
  buyAmount: BigNumber
): StraddleTrade => {
  const [trade, setTrade] = useState<StraddleTrade>(emptyTrade);

  const getBestTrade = useCallback(async () => {
    const spotPriceInWei = BigNumber.from(
      Math.ceil(spotPrice * 100).toString()
    ).mul(scaleFactor);

    const data: Record<string, string> = {
      instrument: instrumentAddress,
      spotPrice: spotPriceInWei.toString(),
      buyAmount: buyAmount.toString(),
    };
    const query = new URLSearchParams(data).toString();
    const url = `${SOR_API_URL}?${query}`;

    try {
      const response = await axios.get(url);
      const trade = convertTradeResponseToStraddleTrade(response.data);
      setTrade(trade);
    } catch (e) {
      throw e;
    }
  }, [instrumentAddress, buyAmount, buyAmount]);

  useEffect(() => {
    if (!buyAmount.isZero()) {
      getBestTrade();
    }
  }, [buyAmount]);

  return trade;
};

const convertTradeResponseToStraddleTrade = (
  response: TradeResponse
): StraddleTrade => {
  const {
    venues,
    totalPremium,
    amounts,
    premiums,
    strikePrices,
    buyData,
    gasPrice,
  } = response;

  return {
    venues,
    totalPremium: BigNumber.from(totalPremium),
    amounts: amounts.map((a) => BigNumber.from(a)),
    callPremium: BigNumber.from("22636934749846005"),
    callStrikePrice: BigNumber.from("500000000000000000000"),
    putPremium: BigNumber.from("22636934749846005"),
    putStrikePrice: BigNumber.from("500000000000000000000"),
    buyData,
    gasPrice: BigNumber.from(gasPrice),
  };
};
