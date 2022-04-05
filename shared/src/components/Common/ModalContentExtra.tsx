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
  margin: ${(props) => props.config?.my ?? "0"}px
    ${(props) => props.config?.mx ?? "-16"}px
    ${(props) => props.config?.my ?? "0"}px
    ${(props) => props.config?.mx ?? "-16"}px;
  border-radius: ${theme.border.radius};
  background: ${colors.background.two};
  z-index: 1;
`;

const ExtraContainer = styled.div<{
  backgroundColor?: string;
  config?: StyleConfig;
}>`
  display: flex;
  background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : colors.background.three};
  border-radius: ${theme.border.radius};
  margin: -16px ${(props) => props.config?.mx ?? "-16"}px
    ${(props) => props.config?.my ?? "-16"}px
    ${(props) => props.config?.mx ?? "-16"}px;
  padding: 16px;
  padding-top: 32px;
`;

interface ModalContentExtraProps extends HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  config?: StyleConfig;
}

const ModalContentExtra: React.FC<ModalContentExtraProps> = (props) => (
  <>
    <EndingBorder config={props.config} />
    <ExtraContainer {...props} />
  </>
);

export default ModalContentExtra;
