import styled from "styled-components";
import colors from "./colors";
import { Link } from "react-router-dom";

export const BaseText = styled.span`
  color: ${colors.text};
  font-family: "Inter", sans-serif;
`;

export const BaseLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

export const Title = styled.span`
  color: ${colors.primaryText};
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  text-transform: uppercase;
`;

export const PrimaryText = styled(BaseText)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;

export const SecondaryText = styled.span`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.48);
`;
