import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import sizes from "../../designSystem/sizes";

interface BarConfig {
  width: number;
  height: number;
  margin: number;
}

const BackgroundAnimatingBarContainer = styled.div`
  display: flex;
  position: absolute;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const PendingBar = styled.div<
  BarConfig & { color: string; transitionDuration: string }
>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => props.color};
  box-shadow: ${(props) =>
    `${props.width / 8}px ${props.width / 4}px ${props.width * 2.5}px ${
      props.color
    }`};
  // transition: all ${(props) => props.transitionDuration} linear;

  &:not(:last-child) {
    margin-right: ${(props) => props.margin}px;
  }
`;

interface BackgroundAnimatingBarProps {
  color: string;
  height: number;
  width: number;
  config?: {
    barWidth?: number;
    margin?: number;
    marginMultiplier?: number;
  };
}

const BackgroundAnimatingBar: React.FC<BackgroundAnimatingBarProps> = ({
  color,
  height,
  width,
  config: { barWidth: _barWidth, margin: _margin, marginMultiplier = 2.5 } = {},
}) => {
  const [activeBarIndex, setActiveBarIndex] = useState<number>(0);

  const [count, barWidth, barMargin] = useMemo(() => {
    const barWidth = _barWidth ? _barWidth : height / 15;
    let margin;

    if (_margin) {
      margin = _margin;
    } else {
      margin = barWidth * marginMultiplier;
    }

    return [
      barWidth + margin ? Math.floor(width / (barWidth + margin)) : 0,
      barWidth,
      margin,
    ];
  }, [_barWidth, _margin, height, marginMultiplier, width]);

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
    <BackgroundAnimatingBarContainer>
      {[...Array(count)].map((_, index) => (
        <PendingBar
          width={barWidth}
          height={height}
          margin={barMargin}
          color={`${color}${gapToAlpha(activeBarIndex - index)}`}
          transitionDuration={`${1000 / count}ms`}
        />
      ))}
    </BackgroundAnimatingBarContainer>
  );
};

export default BackgroundAnimatingBar;
