import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";

interface BarConfig {
  width: number;
  height: number;
  margin: number;
}

const DesktopNFTFrameAnimatingBarContainer = styled.div`
  display: flex;
  position: absolute;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const PendingBar = styled.div<BarConfig & { color: string }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => props.color};
  box-shadow: ${(props) =>
    `${props.width / 8}px ${props.width / 4}px ${props.width * 2.5}px ${
      props.color
    }`};

  &:not(:last-child) {
    margin-right: ${(props) => props.margin}px;
  }
`;

interface DesktopNFTFrameAnimatingBarProps {
  color: string;
  height: number;
  width: number;
}

const DesktopNFTFrameAnimatingBar: React.FC<DesktopNFTFrameAnimatingBarProps> =
  ({ color, height, width }) => {
    const [activeBarIndex, setActiveBarIndex] = useState<number>(0);

    const [count, barWidth, barMargin] = useMemo(() => {
      const barWidth = height / 15;
      const margin = barWidth * 2.5;

      return [
        barWidth + margin ? Math.floor(width / (barWidth + margin)) : 0,
        barWidth,
        margin,
      ];
    }, [height, width]);

    useEffect(() => {
      const animationInterval = setInterval(() => {
        setActiveBarIndex((prev) => (prev + 1) % (count * 5 || prev + 1));
      }, 1000 / count);

      return () => clearInterval(animationInterval);
    }, [count]);

    const gapToAlpha = useCallback((gap: number) => {
      switch (gap) {
        case 0:
          return "FF";
        case 1:
          return "A3";
        case 2:
          return "7A";
        case 3:
          return "3D";
        case 4:
          return "29";
        case 5:
          return "14";
        case 6:
          return "0A";
        default:
          return "03";
      }
    }, []);

    return (
      <DesktopNFTFrameAnimatingBarContainer>
        {[...Array(count)].map((_, index) => (
          <PendingBar
            width={barWidth}
            height={height}
            margin={barMargin}
            color={`${color}${gapToAlpha(activeBarIndex - index)}`}
          />
        ))}
      </DesktopNFTFrameAnimatingBarContainer>
    );
  };

export default DesktopNFTFrameAnimatingBar;
