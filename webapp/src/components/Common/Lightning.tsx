import React, { useMemo } from "react";
import styled, { css, keyframes } from "styled-components";

import colors from "shared/lib/designSystem/colors";

const lightningEffect = keyframes`
  0% {
    opacity: 0;
  }

  80% {
    opacity: 0;
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

interface LightningBarProps {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  height: number;
  width: number;
}

const LightningBar = styled.div<
  LightningBarProps & { fill: string; duration: number }
>`
  position: absolute;
  ${(props) => css`
    height: ${props.height}px;
    width: ${props.width}px;
    background: ${props.fill};
    animation: ${props.duration}s ${lightningEffect} linear infinite;
    ${props.top ? `top: ${props.top}px;` : ``}
    ${props.left ? `left: ${props.left}px;` : ``}
    ${props.right ? `right: ${props.right}px;` : ``}
    ${props.bottom ? `bottom: ${props.bottom}px;` : ``}
  `}
`;

interface LightningProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?:
    | "yield"
    | "volatility"
    | "principalProtection"
    | "capitalAccumulation";
}

const Lightning: React.FC<LightningProps & LightningBarProps> = ({
  theme = "yield",
  ...props
}) => {
  const color = useMemo(() => {
    return Math.random() <= 0.6 ? colors.products[theme] : "white";
  }, [theme]);

  const duration = useMemo(() => {
    return Math.random() * 3 + 1;
  }, []);

  return <LightningBar {...props} fill={color} duration={duration} />;
};

export default Lightning;
