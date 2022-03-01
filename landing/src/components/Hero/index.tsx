import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import { Title, PrimaryText, Button } from "../../designSystem";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";

import sizes from "../../designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import { ExternalAPIDataContext } from "shared/lib/hooks/externalAPIDataContext";

const MainContainer = styled(Container)`
  height: 640px;
  position: relative;

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
  margin: auto;
`;

const CTAButton = styled(Button)`
  &:hover {
    background-color: ${colors.primaryText};
    color: ${colors.background.one};
  }
`;

const Ticker = styled.div`
  width: 100%;
  height: fit-content;
  position: absolute;
  top: 0;
  left: 0;
  background: ${colors.background.three};

  p {
    margin: auto 0;
  }
`;

const Hero = () => {
  return (
    <MainContainer fluid>
      <PriceTicker />
      <TextContainer fluid>
        <Col>
          <TitleContainer>
            <Title>Ribbon Finance</Title>
          </TitleContainer>

          <TitleContainerMobile>
            <TitleSmall>Ribbon Finance</TitleSmall>
          </TitleContainerMobile>

          <SubtitleContainer>
            <SubTitle>
              Earn <strong>Sustainable Yield</strong> through
              <br />
              Decentralized Options Vaults
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

const PriceTicker = () => {
  const { tickerData } = useContext(ExternalAPIDataContext);

  useEffect(() => {
    console.log(tickerData);
  }, [tickerData]);

  return (
    <Ticker>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          className="d-flex justify-content-end mt-auto mb-auto"
          transition={{
            duration: 0.25,
            type: "keyframes",
            ease: "easeOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <Marquee gradient={false} speed={75}>
            <p>hi</p>
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </Ticker>
  );
};
export default Hero;
