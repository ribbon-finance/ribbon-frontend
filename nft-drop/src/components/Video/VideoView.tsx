import React from "react";
import Marquee from "react-fast-marquee/dist";
import styled from "styled-components";

import { Subtitle, Title } from "shared/lib/designSystem";
import { PlayIcon } from "shared/lib/assets/icons/icons";
import sizes from "shared/lib/designSystem/sizes";
import { useNFTDropGlobalState } from "../../store/store";
import colors from "shared/lib/designSystem/colors";

const PlayButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: calc(50% - 80px);
  left: calc(50% - 80px);
  width: 160px;
  height: 160px;
  border-radius: 320px;
  backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.04);
  z-index: 2;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const MarqueeContainer = styled.div`
  position: absolute;
  top: calc(50% - 60px);
  left: 0;
  width: 100vw;
  z-index: 1;
`;

const MobileSkipButtonContainer = styled.div`
  display: none;
  width: 100%;
  position: absolute;
  top: calc(50% + 80px + 48px);

  @media (max-width: ${sizes.md}px) {
    display: flex;
    justify-content: center;
  }
`;

const VideoView: React.FC = () => {
  const [, setViews] = useNFTDropGlobalState("homepageView");

  return (
    <>
      <PlayButton role="button">
        <PlayIcon />
      </PlayButton>
      <MarqueeContainer>
        <Marquee gradient={false} speed={100}>
          <Title fontSize={120} lineHeight={120} className="mr-5">
            HIT PLAY // HIT PLAY // HIT PLAY // HIT PLAY // HIT PLAY //
          </Title>
        </Marquee>
      </MarqueeContainer>
      <MobileSkipButtonContainer>
        <Subtitle
          fontSize={14}
          lineHeight={20}
          role="button"
          onClick={() => setViews("claim")}
          color={colors.text}
        >
          SKIP VIDEO
        </Subtitle>
      </MobileSkipButtonContainer>
    </>
  );
};

export default VideoView;
