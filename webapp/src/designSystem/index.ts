import styled from "styled-components";
import { Link } from "react-router-dom";

import colors from "./colors";
import { mobileWidth } from "./sizes";

export const BaseText = styled.span`
  color: ${colors.text};
  font-family: "Inter", sans-serif;
`;

export const PrimaryText = styled(BaseText)`
  font-family: VCR;
  font-weight: 500;
  font-size: 16px;
  color: white;

  @media (max-width: ${mobileWidth}px) {
    font-size: 24px;
  }
`;

export const BaseLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

export const BaseButton = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 12px 16px;
`;
