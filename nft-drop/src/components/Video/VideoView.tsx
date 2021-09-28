import React, { useMemo, useState } from "react";
import Marquee from "react-fast-marquee/dist";
import styled from "styled-components";
import ReactPlayer from "react-player";

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

const MobileSkipButtonContainer = styled.div<{ playVideo: boolean }>`
  display: none;
  width: 100%;
  position: absolute;
  ${(props) =>
    props.playVideo ? `bottom: 24px;` : `top: calc(50% + 80px + 48px);`}

  @media (max-width: ${sizes.md}px) {
    display: flex;
    justify-content: center;
  }
`;

const VideoView: React.FC = () => {
  const [, setViews] = useNFTDropGlobalState("homepageView");
  const [playVideo, setPlayVideo] = useState(false);

  const content = useMemo(
    () =>
      playVideo ? (
        <ReactPlayer
          className="video-player"
          url="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
          playing={playVideo}
          onEnded={() => setViews("claim")}
          height="100%"
          width="100%"
        />
      ) : (
        <>
          <PlayButton role="button" onClick={() => setPlayVideo(true)}>
            <PlayIcon />
          </PlayButton>
          <MarqueeContainer>
            <Marquee gradient={false} speed={100}>
              <Title fontSize={120} lineHeight={120} className="mr-5">
                HIT PLAY // HIT PLAY // HIT PLAY // HIT PLAY // HIT PLAY //
              </Title>
            </Marquee>
          </MarqueeContainer>
        </>
      ),
    [playVideo, setViews]
  );

  return (
    <>
      {content}
      <MobileSkipButtonContainer playVideo={playVideo}>
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
