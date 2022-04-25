import React from "react";
import styled from "styled-components";

import { SecondaryText } from "../../designSystem";
import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

const HelpContainer = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => (props.color ? props.color : colors.borderLight)};
  border-radius: 100px;
  margin-left: 8px;
  z-index: 1;
  text-transform: none;
`;

interface HelpInfoProps {
  containerRef: React.Ref<any>;
  color?: string;
}

const HelpInfo: React.FC<
  React.HTMLAttributes<HTMLDivElement> & HelpInfoProps
> = ({ children, containerRef, color, ...props }) => {
  return (
    <HelpContainer color={color} {...props} ref={containerRef}>
      <SecondaryText fontSize={10} lineHeight={12} color={color || colors.text}>
        {children}
      </SecondaryText>
    </HelpContainer>
  );
};

export default HelpInfo;
