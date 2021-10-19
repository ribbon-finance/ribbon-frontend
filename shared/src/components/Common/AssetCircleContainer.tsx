import React from "react";
import styled, { keyframes } from "styled-components";

import theme from "../../designSystem/theme";

const circleAnimation = (index: number, borderColor: string) => keyframes`
  ${index * 5}% {
    border: ${theme.border.width} ${theme.border.style} ${borderColor}00;
  }

  ${index * 5 + 16.5}% {
    border: ${theme.border.width} ${theme.border.style} ${borderColor};
  }

  ${index * 5 + 33}% {
    border: ${theme.border.width} ${theme.border.style} ${borderColor}00;
  }
`;

const Circle = styled.div<{
  size: number;
  color: string;
  background?: string;
  circleIndex: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background: ${(props) => props.background || "none"};
  animation: 3s ${(props) => circleAnimation(props.circleIndex, props.color)}
    linear infinite;
`;

interface AssetCircleContainerProps {
  size: number;
  color: string;
}

const AssetCircleContainer: React.FC<AssetCircleContainerProps> = ({
  size,
  color,
  children,
}) => {
  return (
    <Circle size={size} color={color} circleIndex={2}>
      <Circle size={(size * 5) / 6} color={color} circleIndex={1}>
        <Circle
          size={(size * 4) / 6}
          color={color}
          background={`${color}1F`}
          circleIndex={0}
        >
          {children}
        </Circle>
      </Circle>
    </Circle>
  );
};

export default AssetCircleContainer;
