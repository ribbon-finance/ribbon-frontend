import React from "react";
import styled from "styled-components";
import moment from "moment";
import { PrimaryText, Title } from "../../designSystem";
import CurrencyPair from "../../designSystem/CurrencyPair";
import { Product } from "../../models";
import InstrumentItem from "./InstrumentItem";

const ProductContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ProductTerms = styled.div`
  text-align: center;
`;

const ExpiryTerms = styled.div`
  margin-top: 15px;
  margin-bottom: 35px;
`;

const TermDiv = styled.div`
  margin-bottom: 8px;
`;

const EitherWayDiv = styled.div`
  margin-top: 30px;
`;

const EiterWayText = styled(PrimaryText)`
  font-weight: bold;
`;

const CurrencyPairContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 15px;
`;

const InstrumentsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 42px;
`;

type Props = {
  product: Product;
};

const ProductListing: React.FC<Props> = ({ product }) => {
  const { targetCurrency, paymentCurrency } = product;
  const expiryDateTime = moment.unix(product.expiryTimestamp);
  const expiresIn = expiryDateTime.from(moment());

  return (
    <ProductContainer>
      <Title>{product.name}</Title>

      <CurrencyPairContainer>
        <CurrencyPair
          targetCurrency={targetCurrency}
          paymentCurrency={paymentCurrency}
        ></CurrencyPair>
      </CurrencyPairContainer>

      <ProductTerms>
        <ExpiryTerms>
          <PrimaryText>Expires in: {expiresIn}</PrimaryText>
        </ExpiryTerms>
        <TermDiv>
          <PrimaryText>
            If {targetCurrency} settles below the strike, you earn yield in{" "}
            {targetCurrency} terms.
          </PrimaryText>
        </TermDiv>
        <TermDiv>
          <PrimaryText>
            If {targetCurrency} settles above the strike, you earn yield in{" "}
            {paymentCurrency} terms.
          </PrimaryText>
        </TermDiv>
        <EitherWayDiv>
          <EiterWayText>You win either way.</EiterWayText>
        </EitherWayDiv>
      </ProductTerms>

      <InstrumentsContainer>
        {product.instruments.map((instrument) => (
          <InstrumentItem
            key={instrument.symbol}
            instrument={instrument}
          ></InstrumentItem>
        ))}
      </InstrumentsContainer>
    </ProductContainer>
  );
};

export default ProductListing;
