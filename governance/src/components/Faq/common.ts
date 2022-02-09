import { Col } from "react-bootstrap";
import { BaseLink, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";

export const Header = styled(Title)`
  padding-bottom: 24px;
`;

export const FAQBody = styled.div`
  padding: 8px;
  color: ${colors.text};
`;

export const Link = styled(BaseLink)`
  color: white;
  text-decoration: underline;
  &:hover {
    color: white;
  }
`;

export const Section = styled(Col).attrs({
  sm: "11",
  md: "9",
  lg: "7",
  className: "d-flex flex-column",
})`
  padding-top: 64px;
`;
