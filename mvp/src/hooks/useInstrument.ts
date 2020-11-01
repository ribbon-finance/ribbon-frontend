import { useEffect, useState } from "react";
import { products } from "../mockData";
import { Instrument, Product } from "../models";

type NotFoundVal = {
  found: false;
};

type FoundVal = {
  product: Product;
  instrument: Instrument;
  found: true;
};

type ReturnVal = FoundVal | NotFoundVal;

export const useInstrument = (instrumentSymbol: string): ReturnVal => {
  // This simulates fetching the instrument data from the network
  // We pass in a symbol and fetch the instrument
  // useEffect
  // useState

  // recursively search for a matching instrument symbol in the mockdata
  let instrument;

  const product = products.find((product) => {
    instrument = product.instruments.find(
      (instrument) => instrument.symbol === instrumentSymbol
    );
    return Boolean(instrument);
  });

  if (product && instrument) {
    return {
      found: true,
      product,
      instrument
    };
  }

  return {
    found: false
  };
};
