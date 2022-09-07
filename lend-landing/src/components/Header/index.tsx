import React, { useState } from "react";
import styled from "styled-components";

import Logo from "./Logo";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import { Title, BaseLink, Button, SecondaryText } from "../../designSystem";
import MenuButton from "./MenuButton";
import { NavItemProps, MobileMenuOpenProps } from "./types";
import theme from "../../designSystem/theme";
import MobileOverlayMenu from "shared/lib/components/Common/MobileOverlayMenu";
import ItemWithDropdown from "./ItemWithDropdown";
import ExternalLinkIcon from "shared/lib/assets/icons/externalLink";

const HeaderContainer = styled.div`
  display: flex;
  width: 64px;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  border-right: 1px solid ${colors.border};
  padding: 44px 23px 32px 23px;
  z-index: 1000;
  background: black;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const MainContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
const HeaderContainer2 = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  justify-content: center;
  align-items: center;
  z-index: 999;
  border-bottom: 1px solid ${colors.border};
`;

const HeaderContainer3 = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  z-index: 999;
  border-top: 1px solid ${colors.border};
`;

const LogoContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  top: 0;
  bottom: 0;
`;

// const LinksContainer = styled.div`
//   display: flex;
//   align-items: center;
//   height: 100vh;
//   flex-direction: column;
//   justify-content: space-between;
// `;

const ButtonContainer = styled.div`
  display: flex;
  z-index: 0;
  margin-left: auto;
  padding-left: 40px;
  padding-right: 40px;
  height: 100%;
  justify-content: center;
  align-items: center;
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
  border-left: 1px solid ${colors.border};
`;

const Text = styled(Title)`
  text-align: center;
  color: ${colors.primaryText};

  font-size: 14px;
`;

const StyledSecondaryText = styled(SecondaryText)`
  text-align: center;
  color: ${colors.primaryText};
  font-size: 14px;
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
  margin-left: auto;
`;

const TextInnerContainer = styled.div`
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 50%;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  margin-right: 64px;
`;
const TextContainer2 = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: calc(100% / 3);
  text-align: center;
  height: 16px;
  padding-left: 30px;
  padding-right: 30px;
  border-right: 1px solid ${colors.border};
`;

const Header = () => {
  return (
    <MainContainer>
      <HeaderContainer>
        <LogoContainer>
          <Logo></Logo>
        </LogoContainer>
        <TextInnerContainer>
          <Text>Community</Text>
        </TextInnerContainer>

        <TextInnerContainer>
          <Text>About</Text>
        </TextInnerContainer>
      </HeaderContainer>
      <ContentContainer>
        <HeaderContainer2>
          <TextContainer>
            <StyledSecondaryText>
              Earn enhanced yield on USDC deposits
            </StyledSecondaryText>
          </TextContainer>
          <ButtonContainer>
            <a href="https://app.ribbon.finance">
              <ButtonText>OPEN APP</ButtonText>
            </a>
          </ButtonContainer>
        </HeaderContainer2>
        <HeaderContainer3>
          <TextContainer2>
            <StyledSecondaryText>
              Earn enhanced yield on USDC deposits
            </StyledSecondaryText>
          </TextContainer2>
          <TextContainer2>
            <StyledSecondaryText>
              Earn enhanced yield on USDC deposits
            </StyledSecondaryText>
          </TextContainer2>
          <TextContainer2>
            <StyledSecondaryText>
              Earn enhanced yield on USDC deposits
            </StyledSecondaryText>
          </TextContainer2>
        </HeaderContainer3>
      </ContentContainer>
    </MainContainer>
  );
};

export default Header;
