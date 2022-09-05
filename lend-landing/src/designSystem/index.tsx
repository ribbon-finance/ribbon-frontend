import styled from "styled-components";
import theme from "./theme";
import colors from "shared/lib/designSystem/colors";
import Link from "../components/Common/Link";

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
  color: ${colors.primaryText};
  text-transform: uppercase;
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 64px;
  line-height: 64px;
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
  border: 2px solid ${colors.primaryText};
  box-sizing: border-box;
  border-radius: 8px;
  background: transparent;
  color: ${colors.primaryText};
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 30px;
  padding-right: 30px;
  text-transform: uppercase;
  font-family: VCR;
`;

export const BaseButton = styled.div`
  display: flex;
  border-radius: ${theme.border.radius};
  padding: 12px 16px;
`;

export const Subtitle = styled.span`
  color: ${colors.primaryText};
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 1.5px;
`;

export const BaseLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;
