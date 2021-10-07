import React, { useMemo, useState } from "react";
import Marquee from "react-fast-marquee/dist";
import styled, { keyframes } from "styled-components";
import ReactPlayer from "react-player";

import { Subtitle, Title } from "shared/lib/designSystem";
import { PlayIcon } from "shared/lib/assets/icons/icons";
import sizes from "shared/lib/designSystem/sizes";
import { useNFTDropGlobalState } from "../../store/store";
import colors from "shared/lib/designSystem/colors";
import { useRef } from "react";
import useElementSize from "shared/lib/hooks/useElementSize";
import { getThemeColorFromColorway } from "../../utils/colors";

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

const videoProgressBarBackgroundAnimation = keyframes`
   0% {
    background: ${getThemeColorFromColorway(0)};
  }

  20% {
    background: ${getThemeColorFromColorway(1)};
  }

  40% {
    background: ${getThemeColorFromColorway(2)};
  }

  60% {
    background: ${getThemeColorFromColorway(3)};
  }

  80% {
    background: ${getThemeColorFromColorway(4)};
  }

  100% {
    background: ${getThemeColorFromColorway(0)};
  }
`;

const VideoProgressBar = styled.div<{
  progress: number;
  position: "top" | "bottom" | "left" | "right";
}>`
  position: absolute;
  ${(props) => {
    switch (props.position) {
      case "top":
        return `
          top: 0px;
          left: 0px;
        `;
      case "bottom":
        return `
          bottom: 0px;
          right: 0px;
        `;
      case "left":
        return `
          bottom: 0px;
          left: 0px;
        `;
      case "right":
        return `
          top: 0px;
          right: 0px;
        `;
    }
  }}
  ${(props) => {
    switch (props.position) {
      case "top":
      case "bottom":
        return `
          width: ${props.progress}%;
          height: 0.25vh;
        `;
      case "left":
      case "right":
        return `
          height: ${props.progress}%;
          width: 0.25vh;
        `;
    }
  }}
  animation: 10s ${videoProgressBarBackgroundAnimation} linear infinite;
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

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { height, width } = useElementSize(videoContainerRef);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const [progress1, progress2, progress3, progress4] = useMemo(() => {
    if (duration <= 0) {
      return [0, 0, 0, 0];
    }

    const heightRatio = height / (height + width) / 2;
    const widthRatio = width / (height + width) / 2;
    const progressPercentage = progress / duration;

    return [
      Math.min((progressPercentage / widthRatio) * 100, 100),
      progressPercentage > widthRatio
        ? Math.min(((progressPercentage - widthRatio) / heightRatio) * 100, 100)
        : 0,
      progressPercentage > widthRatio + heightRatio
        ? Math.min(
            ((progressPercentage - widthRatio - heightRatio) / widthRatio) *
              100,
            100
          )
        : 0,
      progressPercentage > widthRatio + heightRatio + widthRatio
        ? Math.min(
            ((progressPercentage - widthRatio - heightRatio - widthRatio) /
              heightRatio) *
              100,
            100
          )
        : 0,
    ];
  }, [duration, height, progress, width]);

  const content = useMemo(
    () =>
      playVideo ? (
        <div
          ref={videoContainerRef}
          className="d-flex align-items-center justify-content-center position-relative mx-auto"
        >
          <ReactPlayer
            key="video-player"
            url="https://www.dropbox.com/s/4mr8i8sg6t8ry76/Ribbon%20Finance.mp4"
            playing={playVideo}
            height="100%"
            width="100%"
            onDuration={(duration) => setDuration(duration)}
            progressInterval={20}
            onProgress={(data) => setProgress(data.playedSeconds)}
            onEnded={() => setViews("claim")}
          />
          <VideoProgressBar progress={progress1} position="top" />
          <VideoProgressBar progress={progress2} position="right" />
          <VideoProgressBar progress={progress3} position="bottom" />
          <VideoProgressBar progress={progress4} position="left" />
        </div>
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
    [playVideo, progress1, progress2, progress3, progress4, setViews]
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
