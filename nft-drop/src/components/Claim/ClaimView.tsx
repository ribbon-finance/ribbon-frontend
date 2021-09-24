import React, { useMemo, useRef } from "react";
import styled from "styled-components";

import useElementSize from "shared/lib/hooks/useElementSize";
import NFTFrame from "./NFTFrame";
import sizes from "shared/lib/designSystem/sizes";
import { Title } from "shared/lib/designSystem";
import { useNFTDropGlobalState } from "../../store/store";
import theme from "shared/lib/designSystem/theme";

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

const ClaimView = () => {
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
      <NFTFrame height={frameHeight} width={frameWidth} />
    </div>
  );
};

export default ClaimView;
