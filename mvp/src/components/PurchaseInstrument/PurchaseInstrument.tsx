import React from "react";
import { Instrument, Product } from "../../models";
import {
  CurrencyPairContainer,
  ProductContainer,
  Title
} from "../../designSystem";
import CurrencyPair from "../../designSystem/CurrencyPair";
import styled from "styled-components";
import SettlementCalculator from "./SettlementCalculator";

type Props = {
  product: Product;
  instrument: Instrument;
};

const SettlementContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

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

      <SettlementContainer>
        <SettlementCalculator
          product={product}
          instrument={instrument}
        ></SettlementCalculator>
      </SettlementContainer>
    </ProductContainer>
  );
};

export default PurchaseInstrument;
