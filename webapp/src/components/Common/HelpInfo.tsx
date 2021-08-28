import React from "react";
import { SecondaryText } from "shared/lib/designSystem";

import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import styled from "styled-components";

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
`;

const HelpText = styled(SecondaryText)`
  font-size: 10px;
  line-height: 12px;
`;

interface HelpInfoProps {
  containerRef: React.Ref<any>;
  color?: string;
}

const HelpInfo: React.FC<React.HTMLAttributes<HTMLDivElement> & HelpInfoProps> =
  ({ children, containerRef, color, ...props }) => {
    return (
      <HelpContainer color={color} {...props} ref={containerRef}>
        <HelpText color={color || colors.text}>{children}</HelpText>
      </HelpContainer>
    );
  };

export default HelpInfo;
