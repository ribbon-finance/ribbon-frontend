import React, { useState, useEffect, useMemo, useRef } from "react";
import { Frame } from "framer";
import styled from "styled-components";

import theme from "../../designSystem/theme";
import colors from "../../designSystem/colors";
import { Subtitle } from "../../designSystem";
import useElementScroll from "../../hooks/useElementScroll";

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

  overflow-y: auto;

  /* Firefox */
  scrollbar-width: none;

  /* Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

const ContainerScrollIndicator = styled.div<{
  show: boolean;
  direction: "left" | "right";
}>`
  display: flex;
  ${(props) =>
    props.show
      ? `
          opacity: 1;
        `
      : `
          opacity: 0;
          visibility: hidden;
        `}
  position: absolute;
  height: 60px;
  width: 48px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(270deg, #08090e 40.63%, rgba(8, 9, 14, 0) 100%);
  border-radius: ${theme.border.radius};
  z-index: 2;
  transition: 0.2s all ease-out;
  top: 0;
  ${(props) => {
    switch (props.direction) {
      case "left":
        return `
          left: 0;
          transform: rotate(-180deg);
        `;
      case "right":
        return `
          right: 0;
        `;
    }
  }}
`;

const IndicatorIcon = styled.i`
  color: white;
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
  white-space: nowrap;
`;

interface SegmentControlProps {
  segments: {
    value: string;
    display: string | JSX.Element;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useElementScroll(containerRef);
  console.log(scrollY);

  useEffect(() => {
    const currentCurrency = controlRefs[value].current;

    if (!currentCurrency) {
      return;
    }

    const handleResize = () => {
      setActiveBackgroundState({
        left: currentCurrency.offsetLeft,
        top: currentCurrency.offsetTop,
        height: currentCurrency.clientHeight,
        width: currentCurrency.clientWidth,
      });
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value, controlRefs]);

  return (
    <>
      <SegmentControlContainer
        ref={containerRef}
        theme={theme}
        color={color}
        widthType={widthType}
      >
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
      {/** Scroll Indicator */}
      <ContainerScrollIndicator direction="left" show={scrollY.left > 5}>
        <IndicatorIcon className="fas fa-chevron-right" />
      </ContainerScrollIndicator>
      <ContainerScrollIndicator direction="right" show={scrollY.right > 5}>
        <IndicatorIcon className="fas fa-chevron-right" />
      </ContainerScrollIndicator>
    </>
  );
};

export default SegmentControl;
