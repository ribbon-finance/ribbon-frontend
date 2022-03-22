import React, { useContext } from "react";
import styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import { Title, PrimaryText, Button } from "../../designSystem";
import { Container } from "react-bootstrap";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "../../designSystem/sizes";
import colors from "shared/lib/designSystem/colors";
import { ExternalAPIDataContext } from "shared/lib/hooks/externalAPIDataContext";
import { getAssetLogo } from "shared/lib/utils/asset";
import { Assets } from "shared/lib/store/types";
import ReactPlayer from "react-player";

const MainContainer = styled(Container)`
  height: calc(100vh - 70px);
  position: relative;
  background: transparent;

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
  background: transparent;

  > * {
    z-index: 1;
  }
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
  padding: 8px 0;
  background: ${colors.background.two};
  z-index: 1;

  p {
    margin: auto 0;
  }

  .marquee {
    display: flex;
    height: fit-content;
    justify-content: space-around;

    > * {
      height: 24px;
    }
  }

  .marquee-container {
    overflow: hidden;
    height: fit-content;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  height: 24px;

  > svg {
    height: 24px;
    width: 24px;
    padding: 0 !important;
    margin: auto 0;
  }
`;

const TickerContainer = styled.div`
  display: flex;
  height: fit-content;
  width: fit-content;
  padding: 0 16px;

  > {
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

const TickerTitle = styled(Title)`
  font-size: 12px;
  line-height: 16px;
  margin: auto 0;
  color: ${colors.tertiaryText};
`;

const TickerPrice = styled(Title)`
  font-size: 12px;
  line-height: 16px;
  margin: auto 0;
  color: ${colors.primaryText};
`;

const TickerDivider = styled.div`
  display: block;
  height: 16px;
  width: 2px;
  background: ${colors.border};
`;

const TickerChange = styled(Title)<{ percentage: number }>`
  font-size: 12px;
  line-height: 16px;
  margin: auto 0;
  color: ${(props) =>
    props.percentage === 0
      ? colors.tertiaryText
      : props.percentage > 0
      ? colors.green
      : colors.red};
`;

const FloatingBackgroundContainer = styled.div<{ backgroundColor?: string }>`
  position: absolute;
  top: 40px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  ${(props) =>
    props.backgroundColor ? `background: ${props.backgroundColor};` : ""};
`;

const Hero = () => {
  const { video } = useScreenSize();

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
      <FloatingBackgroundContainer>
        <ReactPlayer
          key="video-player"
          url="https://player.vimeo.com/video/690719326?h=4fa0a1c59a"
          playing={true}
          width={video.width}
          height={video.height}
          style={{
            minWidth: video.width,
            minHeight: video.height,
          }}
          muted
          loop
        />
      </FloatingBackgroundContainer>
      <FloatingBackgroundContainer backgroundColor="#000000AA" />
    </MainContainer>
  );
};

const PriceTicker = () => {
  const { tickerData } = useContext(ExternalAPIDataContext);

  return (
    <Ticker>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          transition={{
            delay: 1,
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
          <Marquee pauseOnHover gradient={false} speed={75} delay={1}>
            {Object.values(tickerData.data).map((token, i) => {
              const Logo = getAssetLogo(token.asset as Assets);
              return (
                <div key={i}>
                  <TickerContainer>
                    <LogoContainer>
                      <Logo showBackground />
                    </LogoContainer>
                    <TickerTitle>{token.asset}</TickerTitle>
                    <TickerPrice>${token.price.toFixed(2)}</TickerPrice>
                    <TickerChange percentage={token.dailyChange}>
                      {token.dailyChange > 0 && "+"}
                      {token.dailyChange.toFixed(2)}%
                    </TickerChange>
                  </TickerContainer>
                  <TickerDivider />
                </div>
              );
            })}
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </Ticker>
  );
};

export default Hero;
