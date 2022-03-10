import React from "react";
import styled, { css, keyframes } from "styled-components";
import colors from "../../designSystem/colors";

const Container = styled.div<{ width: string }>`
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => props.width};
`;

const FloatingBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  margin-top: 32px;
`;

const cascadeFade = keyframes`
  0% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  35% {
    opacity: 0;
  }
`;

const repeatFade = keyframes`
  0% {
    opacity: 0.1;
  }
  20% {
    opacity: 1;
  }
  60% {
    opacity: 0.1;
  }
`;

const FloatingBoxBar = styled.div<{
  color: string;
  barAnimationTime: number;
  numberOfBars: number;
  index: number;
  height?: number;
  animationType?: "default" | "alwaysShow";
}>`
  width: 100%;
  height: ${(props) => props.height || 40}px;
  background: ${(props) => props.color};
  box-shadow: 2px 4px 40px ${(props) => props.color};
  opacity: ${(props) => (props.animationType === "default" ? 0 : 0.1)};
  ${(props) => {
    if (props.animationType === "default") {
      return css`
        animation: ${props.barAnimationTime + 1500}ms ${cascadeFade} ease-in-out
          forwards infinite;
        animation-delay: ${((props.numberOfBars - props.index) *
          props.barAnimationTime) /
        props.numberOfBars}ms;
      `;
    }
    return css`
      animation: ${props.barAnimationTime + 1000}ms ${repeatFade} ease-in-out
        forwards infinite;
      animation-delay: ${(props.numberOfBars - props.index) * 100}ms;
    `;
  }}
`;

interface PendingTransactionLoaderProps {
  active: boolean;
  animationTimeMs?: number;
  numberOfBars?: number;
  width?: string;
  // Color of the bars, defaults to ribbon red
  color?: string;
  barHeight?: number;
  animationType?: "default" | "alwaysShow";
}

const PendingTransactionLoader: React.FC<PendingTransactionLoaderProps> = ({
  color = colors.red,
  active,
  animationTimeMs = 500,
  numberOfBars = 6,
  width = "200px",
  barHeight,
  animationType = "default",
}) => {
  return (
    <Container width={width}>
      <FloatingBox>
        {active &&
          [...new Array(numberOfBars)].map((_item, index) => (
            <FloatingBoxBar
              animationType={animationType}
              key={index}
              color={color}
              barAnimationTime={animationTimeMs}
              numberOfBars={numberOfBars}
              index={index}
              height={barHeight}
            />
          ))}
      </FloatingBox>
    </Container>
  );
};

export default PendingTransactionLoader;
