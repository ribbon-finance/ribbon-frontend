import React, { HTMLAttributes } from "react";
import styled from "styled-components";

import colors from "../../designSystem/colors";
import theme from "../../designSystem/theme";

interface StyleConfig {
  mx?: number;
  my?: number;
}

const EndingBorder = styled.div<{ config?: StyleConfig }>`
  height: 24px;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  z-index: 1;
`;

const ExtraContainer = styled.div<{
  backgroundColor?: string;
  config?: StyleConfig;
  paddingTop?: number;
  earn?: boolean;
}>`
  display: flex;
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.background.three};
  border-radius: ${theme.border.radius};
  margin-top: -16px;
  padding: 24px 16px 8px 16px;
`;

interface ModalContentExtraProps extends HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  config?: StyleConfig;
  paddingTop?: number;
  earn?: boolean;
}

const EarnModalContentExtra: React.FC<ModalContentExtraProps> = (props) => (
  <>
    <EndingBorder config={props.config} />
    <ExtraContainer {...props} />
  </>
);

export default EarnModalContentExtra;
