import React from "react";
import { Instrument, Product } from "../../models";
import {
  CurrencyPairContainer,
  PrimaryText,
  ProductContainer,
  Title
} from "../../designSystem";
import CurrencyPair from "../../designSystem/CurrencyPair";
import { calculateYield } from "../../utils";

type Props = {
  product: Product;
  instrument: Instrument;
};

const PurchaseInstrument: React.FC<Props> = ({ product, instrument }) => {
  const { targetCurrency, paymentCurrency } = product;

  return (
    <ProductContainer>
      <Title>{product.name}</Title>

      <CurrencyPairContainer>
        <CurrencyPair
          targetCurrency={targetCurrency}
          paymentCurrency={paymentCurrency}
        ></CurrencyPair>
      </CurrencyPairContainer>
    </ProductContainer>
  );
};

export default PurchaseInstrument;
