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
