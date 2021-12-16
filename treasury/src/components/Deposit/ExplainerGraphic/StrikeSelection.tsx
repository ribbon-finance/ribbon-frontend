import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import useElementSize from "shared/lib/hooks/useElementSize";
import { ChartWaves } from "../../../assets/icons/vaultExplainer/strikeSelection";

const ChartWavesContainer = styled.div<{ variant: "top" | "bottom" }>`
  display: flex;
  align-items: center;
  width: calc(100% + 4px);
  margin-left: -2px;
  ${(props) => {
    switch (props.variant) {
      case "top":
        return `
          margin-bottom: auto;
          transform: rotate(-180deg);
        `;
      case "bottom":
        return `
          margin-top: auto;
        `;
    }
  }}
`;

const DottedLine = styled.div<{ top: number; active: boolean; color: string }>`
  position: absolute;
  width: 100%;
  left: 0;
  top: ${(props) => props.top}px;
  transition: border 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  ${(props) => {
    if (props.active) {
      return `
        border: 1px dashed ${props.color};
        box-shadow: 2px 4px 16px ${props.color};
      `;
    }

    return `
      border: 1px dashed ${colors.primaryText}29;
      box-shadow: none;
    `;
  }}
`;

interface StrikeSelectionProps {
  color: string;
  isPut: boolean;
}

const StrikeSelection: React.FC<StrikeSelectionProps> = ({ color, isPut }) => {
  const ref = useRef(null);
  const { height } = useElementSize(ref);
  const [activeCounter, setActiveCounter] = useState(0);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setActiveCounter((counter) => counter + 1);
    }, 1100);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div ref={ref} className="d-flex flex-column w-100 h-100 position-relative">
      <ChartWavesContainer variant={isPut ? "top" : "bottom"}>
        <ChartWaves baseColor={color} width="100%" height="auto" />
      </ChartWavesContainer>
      <DottedLine
        color={color}
        top={isPut ? (height * 4) / 5 : height / 5}
        active={activeCounter % 3 === 2}
      />
      <DottedLine
        color={color}
        top={isPut ? (height * 3) / 5 : (height * 2) / 5}
        active={activeCounter % 3 === 1}
      />
      <DottedLine
        color={color}
        top={isPut ? (height * 2) / 5 : (height * 3) / 5}
        active={activeCounter % 3 === 0}
      />
    </div>
  );
};

export default StrikeSelection;
