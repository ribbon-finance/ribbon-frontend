import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Frame } from "framer";
import styled from "styled-components";

import designTheme from "../../designSystem/theme";
import colors from "../../designSystem/colors";
import { Subtitle } from "../../designSystem";
import useElementScroll from "../../hooks/useElementScroll";
import useElementSize from "../../hooks/useElementSize";

type WidthType = "fullWidth" | "maxContent";
type SegmentControlTheme = "outline" | "plain";

const SegmentControlContainer = styled.div<{
  theme?: SegmentControlTheme;
  color?: string;
  backgroundColor?: string;
  widthType: WidthType;
  hideBorderRadius?: boolean;
}>`
  border-radius: ${({ hideBorderRadius }) =>
    hideBorderRadius ? "0" : designTheme.border.radius};
  background-color: ${(props) => {
    if (props.theme === "plain") {
      return "transparent";
    }

    if (props.backgroundColor) {
      return props.backgroundColor;
    }

    if (props.color) {
      return `${props.color}14`;
    }

    return colors.background.two;
  }};
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
  border-radius: ${designTheme.border.radius};
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
  theme?: SegmentControlTheme;
  color?: string;
}>`
  border-radius: ${designTheme.border.radius} !important;
  ${(props) => {
    switch (props.theme) {
      case "outline":
        return `
          transition: 0.25s border ease-out;
          border: ${designTheme.border.width} ${designTheme.border.style} 
            ${props.color ? props.color : colors.primaryText};
          background-color: transparent !important;
        `;
      case "plain":
        return `
          background-color: transparent !important;
        `;
      default:
        return `
          transition: 0.35s background-color ease-out;
          background-color: ${
            props.color ? props.color : colors.primaryText
          }1F !important;
        `;
    }
  }}
`;

const SegmentControlButton = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})<{
  widthType: WidthType;
  px: number;
  py: number;
  spacingBetweenButtons?: boolean;
}>`
  padding: ${(props) => `${props.py}px ${props.px}px`};
  z-index: 1;
  margin-right: ${(props) => (props.spacingBetweenButtons ? "4px" : "0")};

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

const SegmentControlButtonText = styled(Subtitle)<{
  theme?: SegmentControlTheme;
  active?: boolean;
}>`
  letter-spacing: 1px;
  white-space: nowrap;

  ${({ theme, active }) => {
    if (theme === "plain") {
      return `opacity: ${active ? 1 : 0.48};`;
    }
    return "";
  }}
`;

interface SegmentControlProps {
  segments: {
    value: string;
    display: string | JSX.Element;
    textColor?: string;
  }[];
  value: string;
  onSelect: (value: string) => void;
  config?: {
    theme?: SegmentControlTheme;
    color?: string;
    backgroundColor?: string;
    widthType?: WidthType;
    button?: {
      px: number;
      py: number;
      fontSize: number;
      lineHeight: number;
    };
    hideBorderRadius?: boolean;
  };
}

const SegmentControl: React.FC<SegmentControlProps> = ({
  segments,
  value,
  onSelect,
  config: {
    theme,
    color,
    backgroundColor,
    widthType = "maxContent",
    button = { px: 16, py: 12, fontSize: 14, lineHeight: 24 },
    hideBorderRadius,
  } = {},
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
  const { width } = useElementSize(containerRef);

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
        width:
          theme === "outline"
            ? currentCurrency.clientWidth - 1
            : currentCurrency.clientWidth,
      });
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value, controlRefs, theme]);

  const handleScrollLeft = useCallback(() => {
    containerRef.current?.scrollBy({ left: -width, behavior: "smooth" });
  }, [width]);

  const handleScrollRight = useCallback(() => {
    containerRef.current?.scrollBy({ left: width, behavior: "smooth" });
  }, [width]);

  return (
    <>
      <SegmentControlContainer
        ref={containerRef}
        theme={theme}
        color={color}
        backgroundColor={backgroundColor}
        widthType={widthType}
        hideBorderRadius={hideBorderRadius}
      >
        <ActiveBackground
          transition={{
            type: "keyframes",
            ease: "easeOut",
          }}
          initial={{
            height: "100%",
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
            px={button.px}
            py={button.py}
            spacingBetweenButtons={theme !== "outline"}
          >
            <SegmentControlButtonText
              theme={theme}
              active={segment.value === value}
              color={segment.textColor ?? color}
              fontSize={button.fontSize}
              lineHeight={button.lineHeight}
            >
              {segment.display}
            </SegmentControlButtonText>
          </SegmentControlButton>
        ))}
      </SegmentControlContainer>
      {/** Scroll Indicator */}
      <ContainerScrollIndicator
        direction="left"
        show={scrollY.left > 5}
        role="button"
        onClick={handleScrollLeft}
      >
        <IndicatorIcon className="fas fa-chevron-right" />
      </ContainerScrollIndicator>
      <ContainerScrollIndicator
        direction="right"
        show={scrollY.right > 5}
        role="button"
        onClick={handleScrollRight}
      >
        <IndicatorIcon className="fas fa-chevron-right" />
      </ContainerScrollIndicator>
    </>
  );
};

export default SegmentControl;
