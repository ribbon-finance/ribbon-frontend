import React, { useState, useEffect, useMemo } from "react";
import { Frame } from "framer";
import styled from "styled-components";

import theme from "../../designSystem/theme";
import colors from "../../designSystem/colors";
import { Subtitle } from "../../designSystem";

type WidthType = "fullWidth" | "maxContent";

const SegmentControlContainer = styled.div<{
  theme?: "outline";
  color?: string;
  widthType: WidthType;
}>`
  border-radius: ${theme.border.radius};
  background-color: ${(props) =>
    props.color ? `${props.color}14` : colors.backgroundDarker};
  display: flex;
  position: relative;

  ${(props) => {
    switch (props.theme) {
      case "outline":
        return "";
      default:
        return "padding: 8px;";
    }
  }}

  ${(props) => {
    switch (props.widthType) {
      case "fullWidth":
        return `
          flex: 1;
        `;
      case "maxContent":
        return ``;
    }
  }}
`;

const ActiveBackground = styled(Frame)<{
  theme?: "outline";
  color?: string;
}>`
  border-radius: ${theme.border.radius} !important;
  ${(props) => {
    switch (props.theme) {
      case "outline":
        return `
          border: ${theme.border.width} ${theme.border.style} 
            ${props.color ? props.color : colors.primaryText};
          background-color: transparent !important;
        `;
      default:
        return `
          background-color: ${
            props.color ? props.color : colors.primaryText
          }1F !important;
        `;
    }
  }}
`;

const SegmentControlButton = styled.div<{ widthType: WidthType }>`
  padding: 12px 16px;
  z-index: 1;
  margin-right: 4px;

  &:last-child {
    margin-right: 0px;
  }

  ${(props) => {
    switch (props.widthType) {
      case "fullWidth":
        return `
          display: flex;
          flex: 1;
          justify-content: center;
        `;
      case "maxContent":
        return ``;
    }
  }}
`;

const SegmentControlButtonText = styled(Subtitle)`
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
`;

interface SegmentControlProps {
  segments: {
    value: string;
    display: string;
  }[];
  value: string;
  onSelect: (value: string) => void;
  config?: {
    theme?: "outline";
    color?: string;
    widthType?: WidthType;
  };
}

const SegmentControl: React.FC<SegmentControlProps> = ({
  segments,
  value,
  onSelect,
  config: { theme, color, widthType = "maxContent" } = {},
}) => {
  const controlRefs = useMemo(
    () =>
      segments.reduce<any>((acc, curr) => {
        acc[curr.value] = React.createRef();
        return acc;
      }, {}),
    [segments]
  );
  const [activeBackgroundState, setActiveBackgroundState] = useState<
    object | boolean
  >(false);

  useEffect(() => {
    const currentCurrency = controlRefs[value].current;

    if (!currentCurrency) {
      return;
    }

    setActiveBackgroundState({
      left: currentCurrency.offsetLeft,
      top: currentCurrency.offsetTop,
      height: currentCurrency.clientHeight,
      width: currentCurrency.clientWidth,
    });
  }, [value, controlRefs]);

  return (
    <SegmentControlContainer theme={theme} color={color} widthType={widthType}>
      <ActiveBackground
        transition={{
          type: "keyframes",
          ease: "easeOut",
        }}
        initial={{
          height: 0,
          width: 0,
        }}
        animate={activeBackgroundState}
        theme={theme}
        color={color}
      />
      {segments.map((segment) => (
        <SegmentControlButton
          key={segment.value}
          role="button"
          onClick={() => onSelect(segment.value)}
          ref={controlRefs[segment.value]}
          widthType={widthType}
        >
          <SegmentControlButtonText color={color}>
            {segment.display}
          </SegmentControlButtonText>
        </SegmentControlButton>
      ))}
    </SegmentControlContainer>
  );
};

export default SegmentControl;
