import React, { useState, useEffect, useMemo } from "react";
import { Frame } from "framer";
import styled from "styled-components";

import colors from "shared/lib/designSystem/colors";
import { Subtitle } from "shared/lib/designSystem";
import theme from "shared/lib/designSystem/theme";

const SegmentControlContainer = styled.div`
  border-radius: ${theme.border.radius};
  background-color: ${colors.backgroundDarker};
  display: flex;
  position: relative;
  padding: 8px;
`;

const ActiveBackground = styled(Frame)`
  border-radius: ${theme.border.radius} !important;
  background-color: ${colors.primaryText}1F !important;
`;

const SegmentControlButton = styled.div`
  padding: 12px 16px;
  z-index: 1;
  margin-right: 4px;

  &:last-child {
    margin-right: 0px;
  }
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
}

const SegmentControl: React.FC<SegmentControlProps> = ({
  segments,
  value,
  onSelect,
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
    <SegmentControlContainer>
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
      />
      {segments.map((segment) => (
        <SegmentControlButton
          key={segment.value}
          role="button"
          onClick={() => onSelect(segment.value)}
          ref={controlRefs[segment.value]}
        >
          <SegmentControlButtonText>{segment.display}</SegmentControlButtonText>
        </SegmentControlButton>
      ))}
    </SegmentControlContainer>
  );
};

export default SegmentControl;
