import React from "react";
import styled, { keyframes } from "styled-components";
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

const FloatingBoxBar = styled.div<{
  color: string;
  barAnimationTime: number;
  numberOfBars: number;
  index: number;
}>`
  width: 100%;
  height: 40px;
  background: ${(props) => props.color};
  box-shadow: 2px 4px 40px ${(props) => props.color};
  opacity: 0;
  animation: ${(props) => props.barAnimationTime + 1500}ms ${cascadeFade}
    ease-in-out forwards infinite;
  animation-delay: ${(props) =>
    ((props.numberOfBars - props.index) * props.barAnimationTime) /
    props.numberOfBars}ms;
`;

interface PendingTransactionLoaderProps {
  active: boolean;
  animationTimeMs?: number;
  numberOfBars?: number;
  width?: string;
  // Color of the bars, defaults to ribbon red
  color?: string;
}

const PendingTransactionLoader: React.FC<PendingTransactionLoaderProps> = ({
  color = colors.red,
  active,
  animationTimeMs = 500,
  numberOfBars = 6,
  width = "200px",
}) => {
  return (
    <Container width={width}>
      <FloatingBox>
        {active &&
          [...new Array(numberOfBars)].map((_item, index) => (
            <FloatingBoxBar
              key={index}
              color={color}
              barAnimationTime={animationTimeMs}
              numberOfBars={numberOfBars}
              index={index}
            />
          ))}
      </FloatingBox>
    </Container>
  );
};

export default PendingTransactionLoader;
