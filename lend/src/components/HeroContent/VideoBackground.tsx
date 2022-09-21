import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import sizes from "../../designSystem/sizes";
import ReactPlayer from "react-player";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import { AnimatePresence, motion } from "framer";

const FloatingBackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
`;

const Clip = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "visible" : "none")};
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Clip1 = styled(Clip)`
  bottom: 0;
  clip-path: inset(32px calc(75% + 16px) calc(50% + 32px) 32px);
  @media (max-width: ${sizes.lg}px) {
    clip-path: inset(16px calc(75% + 8px) calc(50% + 16px) 16px);
  }
`;

const Clip2 = styled(Clip)`
  clip-path: inset(25% calc(50% + 16px) 25% calc(25% + 16px));
  @media (max-width: ${sizes.lg}px) {
    clip-path: inset(25% calc(50% + 8px) 25% calc(25% + 8px));
  }
`;

const Clip3 = styled(Clip)`
  clip-path: inset(calc(75% + 32px) calc(25% + 16px) 32px calc(50% + 16px));
  @media (max-width: ${sizes.lg}px) {
    clip-path: inset(calc(75% + 16px) calc(25% + 8px) 16px calc(50% + 8px));
  }
`;

const Clip4 = styled(Clip)`
  clip-path: inset(25% 32px calc(50% + 32px) calc(75% + 16px));
  @media (max-width: ${sizes.lg}px) {
    clip-path: inset(25% 16px calc(50% + 16px) calc(75% + 8px));
  }
`;

const VideoBackground: React.FC = () => {
  const { video } = useScreenSize();
  const [clipCount, setCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const clipAmount: number = 4;

  const bg = useMemo(() => {
    return (
      <ReactPlayer
        key="video-player"
        url="https://player.vimeo.com/video/750125689?h=cae093b12e&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        playing={true}
        width={video.width}
        height={video.height}
        style={{
          minWidth: video.width,
          minHeight: video.height,
          position: "absolute",
        }}
        muted
        loop
        onReady={() => {
          setCount(clipCount + 1);
        }}
      />
    );
  }, [clipCount, video.height, video.width]);

  useEffect(() => {
    if (clipCount === clipAmount) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [isLoading, clipCount]);

  return (
    <FloatingBackgroundContainer>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          transition={{
            delay: 3,
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
          <Clip1 show={!isLoading}>{bg}</Clip1>
          <Clip2 show={!isLoading}>{bg}</Clip2>
          <Clip3 show={!isLoading}>{bg}</Clip3>
          <Clip4 show={!isLoading}>{bg}</Clip4>
        </motion.div>
      </AnimatePresence>
    </FloatingBackgroundContainer>
  );
};
export default VideoBackground;
