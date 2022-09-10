import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";
import sizes from "../../designSystem/sizes";
import Header from "../VerticalHeader";
import MobileHeader from "../VerticalHeaderMobile";

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Panel = styled.div<{ marginLeft?: number; marginRight?: number }>`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin-left: ${(props) =>
    props.marginLeft !== undefined ? `${props.marginLeft}px` : `40px`};
  margin-right: ${(props) =>
    props.marginLeft !== undefined ? `${props.marginRight}px` : `0px`};

  @media (max-width: ${sizes.lg}px) {
    margin-left: ${(props) =>
      props.marginLeft !== undefined ? `${props.marginLeft}px` : `16px`};
    margin-right: ${(props) =>
      props.marginLeft !== undefined ? `16px` : `0px`};
  }
`;

const SpecialText = styled(Title)<{ size: number }>`
  color: ${colors.primaryText};
  font-size: ${(props) => props.size}px;
  line-height: ${(props) => props.size}px;
  margin-bottom: 25px;
  font-family: VCR, sans-serif;

  @media (max-width: ${sizes.lg}px) {
    margin-bottom: 0px;
    margin-top: 27px;
  }
`;

const HeroHeaderContainer = styled.div<{ clockwise: boolean }>`
  display: flex;
  width: 100%;
  height: 100;
  -webkit-transform: rotate(
    ${(props) => (props.clockwise ? `90deg` : `-90deg`)}
  );
  -moz-transform: rotate(${(props) => (props.clockwise ? `90deg` : `-90deg`)});
  align-items: center;
  justify-content: center;
  @media (max-width: ${sizes.lg}px) {
    display: none;
  }
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
    z-index: 999;
    overflow: hidden;
    margin: auto 0;
  }
`;

const Video1 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 16px);
  background: grey;
`;

const Video2 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 48px);
  top: 0;
  bottom: 0;
  margin: auto;
  background: grey;
`;

const Video3 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: 104px;
  bottom: 40px;
  margin: auto;
  background: grey;
  medi
`;

const Video4 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 48px);
  top: 0;
  bottom: 0;
  margin: auto;
`;

const Video4Content = styled.div`
  height: 40%;
  width: 100%;
  background: grey;
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
          <Marquee
            style={{ marginRight: clockwise ? -800 : -500 }}
            gradient={false}
            speed={30}
            delay={0}
          >
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
          <Marquee direction={"right"} gradient={false} speed={200} delay={0}>
            {children}
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </HeroHeaderMobileContainer>
  );
};

const HeroContent: React.FC = () => {
  return (
    <ContentContainer>
      <HeroHeaderMobile>
        <SpecialText size={152}>Ribbon Lend</SpecialText>
      </HeroHeaderMobile>
      <MobileHeader />
      <Panel>
        <Video1 />
      </Panel>
      <Panel>
        <Video2 />
      </Panel>
      <Panel>
        <Video3 />
      </Panel>
      <Panel marginLeft={0} marginRight={40}>
        <Video4>
          <Video4Content />
        </Video4>
        <HeroHeader clockwise={true}>
          <SpecialText size={256}>Lend&nbsp;&nbsp;</SpecialText>
        </HeroHeader>
      </Panel>
    </ContentContainer>
  );
};

export default HeroContent;
