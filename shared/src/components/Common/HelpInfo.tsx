import React from "react";
import styled from "styled-components";

import { SecondaryText } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const HelpContainer = styled.div<{ color?: string; hideIcon?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  ${(props) =>
    !props.hideIcon
      ? `border: ${theme.border.width} ${theme.border.style}
    ${props.color ? props.color : colors.borderLight}`
      : ""};
  border-radius: 100px;
  margin-left: 8px;
  z-index: 1;
  text-transform: none;
`;

interface HelpInfoProps {
  containerRef: React.Ref<any>;
  color?: string;
  hideIcon?: boolean;
}

const HelpInfo: React.FC<
  React.HTMLAttributes<HTMLDivElement> & HelpInfoProps
> = ({ children, containerRef, color, hideIcon, ...props }) => {
  return (
    <HelpContainer
      color={color}
      hideIcon={hideIcon}
      {...props}
      ref={containerRef}
    >
      <SecondaryText fontSize={10} lineHeight={12} color={color || colors.text}>
        {children}
      </SecondaryText>
    </HelpContainer>
  );
};

export default HelpInfo;
