import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import theme from "../../designSystem/theme";
import { components } from "../../designSystem/components";
import { ProductDisclaimer } from "../ProductDisclaimer";
// import { StatsMarquee } from "../StatsMarquee";

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
  // uncomment on launch
  // &:hover {
  //   cursor: pointer;
  //   opacity: ${theme.hover.opacity};
  // }
`;

const DisclaimerText = styled.div`
  font-size: 12px;
  color: ${colors.primaryText}52;
  flex: 1;
  text-align: center;
  svg {
    transition: all 0.2s ease-in-out;
    margin-left: 4px;
    opacity: 0.32;
  }
  > a {
    color: ${colors.primaryText}52;
    text-decoration: underline;
    &:hover {
      svg {
        transform: translate(2px, -2px);
      }
    }
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
        {/* uncomment on launch */}
        {/* <a href={URLS.lendApp}> */}
        <OpenAppButton>
          <ButtonText>OPEN APP</ButtonText>
        </OpenAppButton>
        {/* </a> */}
      </ButtonContainer>
    </>
  );
};

export default Footer;
