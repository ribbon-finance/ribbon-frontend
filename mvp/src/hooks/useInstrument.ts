import { useEffect, useState } from "react";
import { products } from "../mockData";
import { Instrument, Product } from "../models";

type NotFoundResult = {
  state: "notFound";
};

type LoadingResult = {
  state: "loading";
};

type FoundResult = {
  product: Product;
  instrument: Instrument;
  state: "success";
};

type Result = FoundResult | LoadingResult | NotFoundResult;

export const useInstrument = (instrumentSymbol: string): Result => {
  // This simulates fetching the instrument data from the network
  // We pass in a symbol and fetch the instrument
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    setTimeout(() => {
      // recursively search for a matching instrument symbol in the mockdata
      let instrument;

      const product = products.find((product) => {
        instrument = product.instruments.find(
          (instrument) => instrument.symbol === instrumentSymbol
        );
        return Boolean(instrument);
      });

      if (product && instrument) {
        setFound(true);
        setInstrument(instrument);
        setProduct(product);
      } else {
        setFound(false);
      }
      setLoading(false);
    }, 500);
  });

  if (loading) {
    return {
      state: "loading"
    };
  } else if (found) {
    return {
      state: "success",
      product: product as Product,
      instrument: instrument as Instrument
    };
  } else {
    return {
      state: "notFound"
    };
  }
};
