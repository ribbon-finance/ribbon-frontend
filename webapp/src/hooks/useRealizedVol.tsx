import { ASSETS } from "shared/lib/constants/deribitConstants";
import axios from "axios";
import { useState, useEffect } from "react";

const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;

export type RealizedVols = Record<string, number[]>;

const defaultValue: { realizedVol: RealizedVols } = {
  realizedVol: Object.fromEntries(Object.keys(ASSETS).map((a) => [a, []])),
};

const coingeckoIDs: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  AAVE: "aave",
  APE: "apecoin",
  AVAX: "avalanche-2",
  // SAVAX: "benqi-liquid-staked-avax",
  NEAR: "near",
  SOL: "solana",
  PERP: "perpetual-protocol",
  BADGER: "badger-dao",
  BAL: "balancer",
  SPELL: "spell-token",
};

export const VolProvider = () => {
  const [vols, setVols] = useState(defaultValue);

  useEffect(() => {
    const fetch = async () => {
      const realizedPromises = ASSETS.map(getCoingeckoRealisedVolTimeSeries);
      const realizedVols = await Promise.all(realizedPromises);

      setVols({
        realizedVol: Object.fromEntries(
          realizedVols.map((rv, idx) => [ASSETS[idx], rv])
        ),
      });
    };
    fetch();
  }, []);
  return vols;
};

export const getCoingeckoRealisedVolTimeSeries = async (asset: string) => {
  const rollingWindow = 7;
  const days = rollingWindow * 4 * 6;
  const url = `https://pro-api.coingecko.com/api/v3/coins/${coingeckoIDs[asset]}/market_chart?x_cg_pro_api_key=${API_KEY}&vs_currency=usd&days=${days}`;
  const prices: [number, number][] = (await axios.get(url)).data["prices"];
  const logReturns: number[] = [];
  let prevPrice: number = 0;
  for (const value of prices) {
    const price = value[1];
    if (prevPrice > 0) {
      const dailyReturn = price / prevPrice;
      logReturns.push(Math.log(dailyReturn));
    }
    prevPrice = price;
  }
  const logReturnsSquared = logReturns.map((x) => Math.pow(x, 2));
  const rollingVol: number[] = [];
  for (let i = rollingWindow; i <= logReturns.length; i++) {
    rollingVol.push(
      Math.sqrt(
        (logReturnsSquared.slice(i - rollingWindow, i).reduce((a, b) => a + b) /
          rollingWindow) *
          365
      )
    );
  }
  return rollingVol;
};
