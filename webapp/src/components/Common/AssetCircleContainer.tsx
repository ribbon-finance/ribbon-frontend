import React from "react";
import styled from "styled-components";

import theme from "shared/lib/designSystem/theme";

const Circle = styled.div<{ size: number; color: string; background?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  border-radius: ${(props) => props.size / 2}px;
  background: ${(props) => props.background || "none"};
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
    <Circle size={size} color={`${color}29`}>
      <Circle size={(size * 5) / 6} color={`${color}66`}>
        <Circle
          size={(size * 4) / 6}
          color={`${color}`}
          background={`${color}1F`}
        >
          {children}
        </Circle>
      </Circle>
    </Circle>
  );
};

export default AssetCircleContainer;
