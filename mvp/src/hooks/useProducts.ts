import { BasicStraddle, Product, Straddle } from "../models";
import instrumentAddresses from "../constants/instruments.json";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { ASSET_ADDRESSES } from "../constants/addresses";

export const useProducts = (): Product[] => {
  const nowTimestamp = Math.floor(Date.now() / 1000);

  const instruments = instrumentAddresses.mainnet
    .filter((details) => parseInt(details.expiry) > nowTimestamp)
    .map((instrumentDetails) => {
      const {
        address,
        instrumentSymbol: symbol,
        expiry: expiryTimestamp,
      } = instrumentDetails;
      const underlying = ASSET_ADDRESSES.ETH;

      return {
        address,
        symbol,
        underlying,
        expiryTimestamp: parseInt(expiryTimestamp),
      };
    });

  return [
    {
      name: "ETH Straddle",
      emoji: "",
      instruments,
    },
  ];
};

export const useDefaultProduct = (): Product => useProducts()[0];

export const useInstrument = (instrumentSymbol: string) => {
  const instrumentDetails = instrumentAddresses.mainnet.find(
    (a) => a.instrumentSymbol === instrumentSymbol
  );

  if (instrumentDetails) {
    const underlying = ASSET_ADDRESSES.ETH;
    const {
      address,
      instrumentSymbol: symbol,
      expiry: expiryTimestamp,
    } = instrumentDetails;

    const instrument = {
      address,
      symbol,
      underlying,
      expiryTimestamp: parseInt(expiryTimestamp),
    };
    return instrument;
  }
  return null;
};

export const useInstrumentAddresses = () => {
  const addresses = instrumentAddresses.mainnet.map((i) => i.address);
  return addresses;
};
