import styled from "styled-components";

export const BaseText = styled.span`
  font-family: "Inter", sans-serif;
`;

export const SecondaryFont = styled.span`
  font-family: "IBM Plex Mono", monospace;
`;

export const PrimaryText = styled(BaseText)`
  font-family: "Inter", sans-serif;
`;

export const PrimaryMedium = styled(BaseText)`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`;

export const SecondaryText = styled(BaseText)`
  color: white;
`;

export const Title = styled(BaseText)`
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
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

export const Button = styled.button`
  border: none;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  text-align: center;
`;
