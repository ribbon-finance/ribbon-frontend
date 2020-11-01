import React from "react";
import { useParams } from "react-router-dom";
import { useInstrument } from "../../hooks/useInstrument";
import { Instrument, Product } from "../../models";
import Content404 from "../Content404";

type PurchaseInstrumentWrapperProps = {};

interface ParamTypes {
  instrumentSymbol: string;
}

const PurchaseInstrumentWrapper: React.FC<PurchaseInstrumentWrapperProps> = () => {
  const { instrumentSymbol } = useParams<ParamTypes>();
  const res = useInstrument(instrumentSymbol);
  let comp;

  switch (res.found) {
    case true:
      comp = (
        <PurchaseInstrument
          instrument={res.instrument}
          product={res.product}
        ></PurchaseInstrument>
      );
      break;
    case false:
      comp = <Content404></Content404>;
      break;
  }
  return comp;
};

type Props = {
  product: Product;
  instrument: Instrument;
};

const PurchaseInstrument: React.FC<Props> = ({ product, instrument }) => {
  return (
    <div>
      {product.name}
      {instrument.symbol}
    </div>
  );
};

export default PurchaseInstrumentWrapper;
