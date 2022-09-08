import React from "react";
import styled from "styled-components";
import colors from "shared/lib/designSystem/colors";
import { Title } from "shared/lib/designSystem/index";
import { AnimatePresence, motion } from "framer";
import Marquee from "react-fast-marquee/dist";

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Panel = styled.div<{ marginLeft?: number }>`
  display: flex;
  position: relative;
  width: 25%;
  height: 100%;
  overflow: hidden;
  margin-left: ${(props) =>
    props.marginLeft !== undefined ? `${props.marginLeft}px` : `40px`};
  background: ${(props) => props.color};
`;

const SpecialText = styled(Title)<{ size: number }>`
  color: ${colors.primaryText};
  font-size: 256px;
  line-height: 256px;
  margin-bottom: 17px;
  font-family: VCR, sans-serif;
`;

const HeroHeaderContainer = styled.div<{ clockwise: boolean }>`
  display: flex;
  max-width: 100%;
  height: 100%;
  -webkit-transform: rotate(
    ${(props) => (props.clockwise ? `90deg` : `-90deg`)}
  );
  -moz-transform: rotate(${(props) => (props.clockwise ? `90deg` : `-90deg`)});
  text-align: center;
  align-self: center;
  align-items: center;
  justify-content: center;
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
          <Marquee
            style={{ textAlign: "center" }}
            gradient={false}
            speed={50}
            delay={1}
          >
            {children}
          </Marquee>
        </motion.div>
      </AnimatePresence>
    </HeroHeaderContainer>
  );
};

const HeroContent: React.FC = () => {
  return (
    <ContentContainer>
      <Panel>
        <Video1 />
        <HeroHeader clockwise={false}>
          <SpecialText size={256}>Ribbon</SpecialText>
        </HeroHeader>
      </Panel>
      <Panel>
        <Video2 />
      </Panel>
      <Panel>
        <Video3 />
      </Panel>
      <Panel marginLeft={0}>
        <Video4>
          <Video4Content />
        </Video4>
        <HeroHeader clockwise={true}>
          <SpecialText size={256}>Lend</SpecialText>
        </HeroHeader>
      </Panel>
    </ContentContainer>
  );
};

export default HeroContent;
