import styled from "styled-components";

export const BaseText = styled.span`
  font-family: "Roboto", sans-serif;
`;

export const PrimaryText = styled(BaseText)`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 23px;
`;

export const SecondaryText = styled(BaseText)`
  color: white;
`;

export const Title = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 48px;
  line-height: 56px;
  text-align: center;

  color: #000000;
`;

export const ProductContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const CurrencyPairContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 15px;
`;
