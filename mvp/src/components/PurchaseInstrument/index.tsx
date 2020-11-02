import React from "react";
import { useParams } from "react-router-dom";
import { useInstrument } from "../../hooks/useInstrument";
import Content404 from "../Content404";
import PurchaseInstrument from "./PurchaseInstrument";

type PurchaseInstrumentWrapperProps = {};

interface ParamTypes {
  instrumentSymbol: string;
}

const PurchaseInstrumentWrapper: React.FC<PurchaseInstrumentWrapperProps> = () => {
  const { instrumentSymbol } = useParams<ParamTypes>();
  const res = useInstrument(instrumentSymbol);
  let comp;

  switch (res.state) {
    case "success":
      comp = (
        <PurchaseInstrument
          instrument={res.instrument}
          product={res.product}
        ></PurchaseInstrument>
      );
      break;
    case "notFound":
      comp = <Content404></Content404>;
      break;
    case "loading":
      comp = <div style={{ textAlign: "center" }}>Loading...</div>;
      break;
  }
  return comp;
};

export default PurchaseInstrumentWrapper;
