import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";
import sizes from "../../designSystem/sizes";
import ReactPlayer from "react-player";
import useScreenSize from "shared/lib/hooks/useScreenSize";

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
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
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
    margin-top: 32px;
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
    z-index: 1000;
    margin: auto 0;
  }
`;

const Video1 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 16px);
  background: grey;
  overflow: hidden;
`;

const Video2 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: calc(50% - 48px);
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: grey;
`;

const Video3 = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  height: 104px;
  bottom: 40px;
  margin: auto;
  @media (max-width: ${sizes.lg}px) {
    bottom: 16px;
  }
  background: grey;
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
  position: relative;
  height: 40%;
  width: 100%;
  background: grey;
`;

const Container = styled.div<{ backgroundColor?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 10000;
  background: black;
`;

const FloatingBackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
  background: black;
`;

const C1 = styled.div`
  position: relative;
  background: blue;
  width: 100%;
  height: 40px;
  overflow: hidden;
`;

const C2 = styled.div`
  position: absolute;
  background: transparent;
  width: 50%;
  height: 40px;
  z-index: 998;
`;

const C3 = styled.div`
  position: absolute;
  background: white;
  width: 25%;
  height: 40px;
  z-index: 1000;
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
  const { video } = useScreenSize();

  return (
    <ContentContainer>
      {/* <FloatingBackgroundContainer>
        <ReactPlayer
          key="video-player"
          url="https://player.vimeo.com/video/748213676?h=6ac437c1b3&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
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
      </FloatingBackgroundContainer> */}
      <HeroHeaderMobile>
        <SpecialText size={152}>Ribbon Lend</SpecialText>
      </HeroHeaderMobile>
      <Panel>
        <HeroHeader clockwise={false}>
          <SpecialText size={256}>Ribbon</SpecialText>
        </HeroHeader>
        <Video1/>
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
