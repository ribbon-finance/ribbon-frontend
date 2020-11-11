import React from "react";
import styled from "styled-components";
import moment from "moment";
import {
  CurrencyPairContainer,
  PrimaryText,
  ProductContainer,
  Title,
} from "../../designSystem";
import CurrencyPair from "../../designSystem/CurrencyPair";
import { Instrument, Product } from "../../models";
import InstrumentItem from "./InstrumentItem";
import { useInstruments } from "../../hooks/useInstruments";

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
  const res = useInstruments();
  let instruments: Instrument[] = [];
  let errorMessage = "Loading...";

  switch (res.status) {
    case "loading":
      break;
    case "error":
      errorMessage = "Failed to load instruments.";
      break;
    case "success":
      instruments = res.instruments;
      break;
  }

  return (
    <ProductContainer>
      <Title>{product.name}</Title>

      <CurrencyPairContainer>
        <CurrencyPair
          targetCurrency={targetCurrency}
          paymentCurrency={"USDC"}
        ></CurrencyPair>
      </CurrencyPairContainer>

      <ProductTerms>
        <ExpiryTerms>
          <PrimaryText>Expires: {expiresIn}</PrimaryText>
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
            USD terms.
          </PrimaryText>
        </TermDiv>
        <EitherWayDiv>
          <EiterWayText>You win either way.</EiterWayText>
        </EitherWayDiv>
      </ProductTerms>

      <InstrumentsContainer>
        {res.status === "error" ? errorMessage : null}
        {instruments.map((instrument) => (
          <InstrumentItem
            key={instrument.symbol}
            product={product}
            instrument={instrument}
          ></InstrumentItem>
        ))}
      </InstrumentsContainer>
    </ProductContainer>
  );
};

export default ProductListing;
