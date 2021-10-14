import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Title, PrimaryText, Button } from "../../designSystem";
import { Container } from "react-bootstrap";

import sizes from "../../designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import theme from "../../designSystem/theme";

const ColorColumn = styled(Col)<{
  activeColor: string;
}>`
  height: 640px;
  transition: background-color 200ms ease-out, box-shadow 200ms ease-out;
  border-radius: 0px 0px ${theme.border.radius} ${theme.border.radius};

  &:hover {
    background-color: ${(p) => p.activeColor};
    box-shadow: 8px 16px 120px ${(p) => p.activeColor};
  }
`;

const MainContainer = styled(Container)`
  height: 640px;

  @media (max-width: ${sizes.md}px) {
    height: 540px;
  }
`;

const SubtitleContainer = styled.div`
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
`;

const SubTitle = styled(PrimaryText)`
  color: ${colors.primaryText};
`;

const BackgroundContainer = styled(Row)`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const HeroContainer = styled(Container)`
  position: relative;
`;

const TextContainer = styled(Row)`
  pointer-events: none;
  height: 100%;
  align-items: center;
  text-align: center;
`;

const TitleContainer = styled.div`
  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const TitleContainerMobile = styled.div`
  display: none;
  @media (max-width: ${sizes.md}px) {
    display: flex;
  }
`;

const TitleSmall = styled(Title)`
  font-size: 48px;
`;

const TitleAlt = styled(Title)`
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2px white;
`;

const TitleAltSmall = styled(TitleSmall)`
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2px white;
`;

const CTAButton = styled(Button)`
  &:hover {
    background-color: ${colors.primaryText};
    color: ${colors.background.one};
  }
`;

const Hero = () => {
  return (
    <MainContainer fluid>
      <HeroContainer fluid style={{ position: "relative" }}>
        <BackgroundContainer>
          <ColorColumn activeColor={colors.red} />
          <ColorColumn activeColor={colors.products.volatility} />
          <ColorColumn activeColor={colors.green} />
          <ColorColumn activeColor={colors.products.capitalAccumulation} />
        </BackgroundContainer>
      </HeroContainer>

      <TextContainer fluid>
        <Col>
          <TitleContainer>
            <Title>
              Sustainable <TitleAlt>Alpha</TitleAlt> <br></br>For Everyone
            </Title>
          </TitleContainer>

          <TitleContainerMobile>
            <TitleSmall>
              Sustainable <TitleAltSmall>Alpha</TitleAltSmall> For Everyone
            </TitleSmall>
          </TitleContainerMobile>

          <SubtitleContainer>
            <SubTitle>
              Earn yield on your cryptoassets with DeFi's first structured
              products protocol.
            </SubTitle>
          </SubtitleContainer>
          <ButtonContainer>
            <a
              href="https://app.ribbon.finance"
              target="_blank"
              rel="noreferrer noopener"
            >
              <CTAButton>START EARNING</CTAButton>
            </a>
          </ButtonContainer>
        </Col>
      </TextContainer>
    </MainContainer>
  );
};

export default Hero;
