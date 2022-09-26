import React from "react";
import styled, { keyframes } from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";
import sizes from "../../designSystem/sizes";
import VideoBackground from "./VideoBackground";

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Panel = styled.div<{ marginLeft?: number; marginRight?: number }>`
  display: flex;
  position: relative;
  width: calc(25% - 48px);
  height: 100%;
  overflow: hidden;
  z-index: 1000;
  margin-left: ${(props) =>
    props.marginLeft !== undefined ? `${props.marginLeft}px` : `40px`};
  margin-right: ${(props) =>
    props.marginRight !== undefined ? `${props.marginRight}px` : `0px`};
`;

const SpecialText = styled(Title)<{ size: number; marginLeft: number }>`
  color: ${colors.primaryText};
  font-size: ${(props) => props.size}px;
  line-height: ${(props) => props.size}px;
  margin-bottom: 25px;
  margin-left: ${(props) => props.marginLeft}px;
  font-family: VCR, sans-serif;
  @media (max-width: ${sizes.lg}px) {
    margin-bottom: 8px;
  }
`;

const HeroHeaderContainer = styled.div<{ clockwise: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  -webkit-transform: rotate(
    ${(props) => (props.clockwise ? `90deg` : `-90deg`)}
  );
  -moz-transform: rotate(${(props) => (props.clockwise ? `90deg` : `-90deg`)});
  align-items: center;
  justify-content: center;
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
  z-index: 1000;
`;

const HeroHeaderMobileContainer = styled.div`
  display: none;
  @media (max-width: ${sizes.lg}px) {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 1001;
    margin: auto 0;
  }
`;

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

const FrameBar = styled.div<{
  color: string;
  position: "top" | "bottom";
  height: number;
}>`
  display: flex;
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 8%,
    ${props.color} 50%,
    ${props.color}00 92%
  )`};

  box-shadow: 4px 8px 80px 4px rgba(62, 115, 196, 0.43);
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;

  &:before {
    content: "";
    z-index: -1;
    position: absolute;
    ${(props) => props.position}: 0;
    right: 0;
    left: 0;
    background: inherit;
    filter: blur(${(props) => props.height / 2}px);
    opacity: 1;
    transition: opacity 0.3s;
    height: ${(props) => props.height}px;
  }
`;

interface HeroHeaderInterface {
  clockwise: boolean;
}

const HeroHeader: React.FC<HeroHeaderInterface> = ({ children, clockwise }) => {
  return (
    <HeroHeaderContainer clockwise={clockwise}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          transition={{
            delay: 1.5,
            duration: 0.5,
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
          <Marquee gradient={false} speed={30} delay={0}>
            {children}
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </HeroHeaderContainer>
  );
};

const HeroHeaderMobile: React.FC = ({ children }) => {
  return (
    <HeroHeaderMobileContainer>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          transition={{
            delay: 1.5,
            duration: 0.5,
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
          <Marquee direction={"right"} gradient={false} speed={200} delay={0}>
            {children}
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </HeroHeaderMobileContainer>
  );
};

interface HeroContentInterface {
  word: "depositing" | "withdrawing" | "ribbon lend";
}
const HeroContent: React.FC<HeroContentInterface> = ({ word }) => {
  return (
    <>
      {word !== "ribbon lend" && (
        <FrameBar color={colors.asset.USDC} position="top" height={4} />
      )}
      <ContentContainer>
        <VideoBackground />
        <HeroHeaderMobile>
          <SpecialText
            size={152}
            marginLeft={word === "ribbon lend" ? 0 : -300}
          >
            {word}
          </SpecialText>
        </HeroHeaderMobile>
        <div className="d-flex align-items-center justify-content-between w-100 h-100">
          <Panel marginLeft={32} marginRight={0}>
            <HeroHeader clockwise={false}>
              <SpecialText
                size={256}
                marginLeft={word === "ribbon lend" ? 0 : -600}
              >
                {word}
              </SpecialText>
            </HeroHeader>
          </Panel>
          <Panel marginLeft={0} marginRight={32}>
            <HeroHeader clockwise={true}>
              <SpecialText
                size={256}
                marginLeft={word === "ribbon lend" ? 0 : -600}
              >
                {word}
              </SpecialText>
            </HeroHeader>
          </Panel>
        </div>
      </ContentContainer>
      {word !== "ribbon lend" && (
        <FrameBar color={colors.asset.USDC} position="bottom" height={4} />
      )}
    </>
  );
};
export default HeroContent;
