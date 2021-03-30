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
  color: #ffffff;
  text-transform: uppercase;
  font-family: VCR OSD Mono;
  font-style: normal;
  font-weight: normal;
  font-size: 72px;
  line-height: 72px;
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
  pointer-events: auto;
  border: 2px solid #ffffff;
  box-sizing: border-box;
  border-radius: 8px;
  background: transparent;
  color: #ffffff;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 30px;
  padding-right: 30px;
  text-transform: uppercase;
  font-family: VCR OSD Mono;
`;
