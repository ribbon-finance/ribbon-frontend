import React from "react";
import styled, { css, keyframes } from "styled-components";
import colors from "shared/lib/designSystem/colors";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

const barMarginRight = `16px`;

const Container = styled.div<{ width: string }>`
  display: flex;
  position: absolute;
  width: ${(props) => props.width};
`;

const FloatingBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 80px);
`;

const cascadeFade = keyframes`
  0% {
    opacity: 0;
  }
  15% {
    opacity: 0.24;
  }
  50% {
    opacity: 0;
  }
`;

const FloatingBoxBar = styled.div<{
  color: string;
  barAnimationTime: number;
  numberOfBars: number;
  index: number;
  height?: number;
  lastBarWidth: number;
  animationType?: "default" | "alwaysShow";
}>`
  width: ${(props) =>
    props.index === props.numberOfBars - 1
      ? `${props.lastBarWidth}px`
      : `calc((100vw - ${barMarginRight} * ${props.numberOfBars - 1} - ${
          props.lastBarWidth
        }px) / ${props.numberOfBars - 1})`};
  height: 100%;
  background: ${(props) => props.color};
  box-shadow: 2px 4px 40px ${(props) => props.color};
  opacity: 0;
  margin-right: ${barMarginRight};
  ${(props) => {
    return css`
      animation: ${props.barAnimationTime + 2500}ms ${cascadeFade} ease-in-out
        forwards infinite;
      animation-delay: ${(props.index * props.barAnimationTime) /
      props.numberOfBars}ms;
    `;
  }}
  @media (max-width: calc(${sizes.md}px)) {
    display: none;
  }
`;

interface BackgroundLoaderProps {
  active: boolean;
  animationTimeMs?: number;
  numberOfBars?: number;
  width?: string;
  // Color of the bars, defaults to ribbon red
  color?: string;
  barHeight?: number;
  animationType?: "default" | "alwaysShow";
}

const BackgroundLoader: React.FC<BackgroundLoaderProps> = ({
  color = colors.primaryText,
  active,
  animationTimeMs = 500,
  numberOfBars = 7,
  width = "100%",
  barHeight,
  animationType = "default",
}) => {
  const { width: screenWidth } = useScreenSize();

  return (
    <Container width={width}>
      <FloatingBox>
        {active &&
          [...new Array(numberOfBars)].map((_item, index) => (
            <FloatingBoxBar
              animationType={animationType}
              key={index}
              color={
                index === 0
                  ? `${color}08`
                  : index === 1
                  ? `${color}16`
                  : index === 2
                  ? `${color}32`
                  : index === 3
                  ? `${color}40`
                  : index === 4
                  ? `${color}48`
                  : index === 5
                  ? `${color}64`
                  : `${color}`
              }
              barAnimationTime={animationTimeMs}
              numberOfBars={numberOfBars}
              index={index}
              height={barHeight}
              lastBarWidth={screenWidth / 4}
            />
          ))}
      </FloatingBox>
    </Container>
  );
};

export default BackgroundLoader;
