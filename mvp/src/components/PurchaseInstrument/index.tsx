import React from "react";
import { useParams } from "react-router-dom";

type Props = {};

interface ParamTypes {
  instrumentSymbol: string;
}

const PurchaseInstrument: React.FC<Props> = () => {
  const { instrumentSymbol } = useParams<ParamTypes>();
  return <div>{instrumentSymbol}</div>;
};

export default PurchaseInstrument;
