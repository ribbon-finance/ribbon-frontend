import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import { components } from "../../designSystem/components";
import { ProductDisclaimer } from "../ProductDisclaimer";
import { Link } from "react-router-dom";
import { StatsMarquee } from "../StatsMarquee";
import theme from "../../designSystem/theme";

const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  min-height: ${components.footer}px;
  align-items: center;
  z-index: 1001;
  background: black;
  border-top: 1px solid ${colors.border};
`;

const ButtonText = styled.span`
  font-family: VCR;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: ${colors.green};
`;

const ButtonContainer = styled.div`
  display: none;
  @media (max-width: ${sizes.lg}px) {
    display: flex;
    margin-left: auto;
    padding-left: 40px;
    padding-right: 40px;
    height: 64px;
    min-height: 64px;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-top: 1px solid ${colors.border};
    z-index: 10000;
  }
`;

const OpenAppButton = styled.div`
  display: flex;
  width: 100vw;
  height: 64px;
  justify-content: center;
  align-items: center;
  text-align: center;
  &:hover {
    cursor: pointer;
    opacity: ${theme.hover.opacity};
  }
`;

const Footer: React.FC = () => {
  return (
    <>
      <FooterContainer>
        {/* <StatsMarquee/> */}
        <ProductDisclaimer />
      </FooterContainer>
      <ButtonContainer>
        <Link to={"/app"}>
          <OpenAppButton>
            <ButtonText>OPEN APP</ButtonText>
          </OpenAppButton>
        </Link>
      </ButtonContainer>
    </>
  );
};

export default Footer;
