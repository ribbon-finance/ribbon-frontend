import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import useElementSize from "shared/lib/hooks/useElementSize";
import NFTFrame from "./NFTFrame";
import sizes from "shared/lib/designSystem/sizes";
import { SecondaryText, Title } from "shared/lib/designSystem";
import { useNFTDropGlobalState } from "../../store/store";
import theme from "shared/lib/designSystem/theme";
import { useNFTDropData } from "../../hooks/nftDataContext";
import colors from "shared/lib/designSystem/colors";

const MobileInfoButton = styled.div`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 24px;
    opacity: ${theme.hover.opacityLow};

    &:hover {
      opacity: 1;
    }
  }
`;

const MobileNoClaimableText = styled(SecondaryText)<{ frameHeight: number }>`
  display: none;

  @media (max-width: ${sizes.md}px) {
    display: block;
    position: absolute;
    top: calc(50% + ${(props) => props.frameHeight / 2}px + 24px);
  }
`;

const ClaimView = () => {
  const { active } = useWeb3React();
  const nftDropData = useNFTDropData();

  const ref = useRef<HTMLDivElement>(null);
  const { height, width } = useElementSize(ref);
  const [, setShowInfoModal] = useNFTDropGlobalState("shwoInfoModal");

  const [frameHeight, frameWidth] = useMemo(() => {
    const maxHeight = height * 0.7;

    return [
      Math.min(maxHeight, (width * 11) / 8),
      Math.min((maxHeight * 8) / 11, width),
    ];
  }, [height, width]);

  return (
    <div
      ref={ref}
      className="d-flex justify-content-center align-items-center w-100 h-100 position-relative"
    >
      <MobileInfoButton role="button" onClick={() => setShowInfoModal(true)}>
        <Title fontSize={16} lineHeight={24}>
          INFO
        </Title>
      </MobileInfoButton>
      <NFTFrame
        height={frameHeight}
        width={frameWidth}
        animatingWidth={width}
      />
      {active && !nftDropData.tokenId ? (
        <MobileNoClaimableText
          frameHeight={frameHeight}
          color={colors.primaryText}
        >
          Unfortunately, you don’t have a claimable NFT
        </MobileNoClaimableText>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClaimView;
