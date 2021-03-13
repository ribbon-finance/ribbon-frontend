import styled from "styled-components";

export const BaseText = styled.span`
  font-family: "Inter", sans-serif;
`;

export const SecondaryFont = styled.span`
  font-family: "IBM Plex Mono", monospace;
`;

export const PrimaryText = styled(BaseText)`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
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
  font-family: Orbitron;
  font-style: normal;
  font-weight: normal;
  font-size: 64px;
  color: #ffffff;
  line-height: 80px;
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
  padding: 14px;
  background: #ffffff;
  border-radius: 8px;
  pointer-events: auto;
`;
