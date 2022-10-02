import React from "react";
import styled from "styled-components";
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
  word: "depositing" | "withdrawing" | "ribbon lend" | "borrowing" | "repaying";
}
const HeroContent: React.FC<HeroContentInterface> = ({ word }) => {
  return (
    <>
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
    </>
  );
};
export default HeroContent;
