import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";

import { PrimaryText } from "shared/lib/designSystem";
import {
  getLogoColorFromColorway,
  getThemeColorFromColorway,
} from "../../utils/colors";
import Logo from "shared/lib/assets/icons/logo";
import { useNFTDropData } from "../../hooks/nftDataContext";
import { useNFTDropGlobalState } from "../../store/store";
import BackgroundAnimatingBar from "shared/lib/components/Common/BackgroundAnimatingBar";

const Frame = styled.div<{ width: number; height: number }>`
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px);
  overflow: hidden;
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
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${props.color}00 5%,
    ${props.color} 50%,
    ${props.color}00 95%
  )`};
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
    filter: blur(${(props) => props.height * 4}px);
    opacity: 1;
    transition: opacity 0.3s;
    height: ${(props) => props.height * 2}px;
  }
`;

interface NFTFrameProps {
  height: number;
  width: number;
  animatingWidth: number;
}

const NFTFrame: React.FC<NFTFrameProps> = ({
  height,
  width,
  animatingWidth,
}) => {
  const { active } = useWeb3React();
  const nftDropData = useNFTDropData();
  const [, setClaimButtonWidth] = useNFTDropGlobalState("claimButtonWidth");

  useEffect(() => {
    setClaimButtonWidth(width);
  }, [setClaimButtonWidth, width]);

  const content = useMemo(() => {
    if (!active) {
      return (
        <PrimaryText fontSize={14} lineHeight={20}>
          Please connect your wallet
        </PrimaryText>
      );
    }

    if (nftDropData.colorway !== undefined) {
      return (
        <Logo
          key={nftDropData.tokenId}
          width="37.5%"
          color={getLogoColorFromColorway(nftDropData.colorway)}
        />
      );
    }
  }, [active, nftDropData.colorway, nftDropData.tokenId]);

  return (
    <>
      <Frame height={height} width={width}>
        <FrameBar
          color={getThemeColorFromColorway(nftDropData.colorway)}
          position="top"
          height={height / 55}
        />
        <div className="d-flex align-items-center justify-content-center flex-grow-1 w-100">
          {content}
        </div>
        <FrameBar
          color={getThemeColorFromColorway(nftDropData.colorway)}
          position="bottom"
          height={height / 55}
        />
      </Frame>
      {nftDropData.colorway !== undefined && (
        <BackgroundAnimatingBar
          color={getThemeColorFromColorway(nftDropData.colorway)}
          height={(height * 6) / 11}
          width={animatingWidth}
        />
      )}
    </>
  );
};

export default NFTFrame;
