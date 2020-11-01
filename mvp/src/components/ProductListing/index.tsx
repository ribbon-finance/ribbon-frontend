import React from "react";
import styled from "styled-components";
import { PrimaryText, Title } from "../DesignSystem";
import { Product } from "../../models";
import currencyIcons from "../../img/currencyIcons";

const ProductContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CurrencyPair = styled.div`
  display: flex;
  flex-direction: row;
`;

const CurrencyIcon = styled.img`
  width: 66px;
  height: 66px;
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

type Props = {
  product: Product;
};

const ProductListing: React.FC<Props> = ({ product }) => {
  const { targetCurrency, paymentCurrency } = product;

  return (
    <ProductContainer>
      <Title>{product.name}</Title>

      <CurrencyPair>
        <CurrencyIcon
          src={currencyIcons[targetCurrency]}
          alt={targetCurrency}
        ></CurrencyIcon>
        <CurrencyIcon
          src={currencyIcons[paymentCurrency]}
          alt={paymentCurrency}
        ></CurrencyIcon>
      </CurrencyPair>

      <ProductTerms>
        <ExpiryTerms>
          <PrimaryText>Expires in:</PrimaryText>
        </ExpiryTerms>
        <TermDiv>
          <PrimaryText>
            If {targetCurrency} settles below the strike, you earn yield in{" "}
            {targetCurrency} terms. You win either way.
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
    </ProductContainer>
  );
};

export default ProductListing;
