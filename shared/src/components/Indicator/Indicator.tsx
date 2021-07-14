import React from "react";
import styled from "styled-components";
import colors from "../../designSystem/colors";

const Container = styled.div<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 4px;
  margin-right: 8px;
  overflow: hidden;
  background-color: ${(props) => (props.connected ? colors.green : colors.red)};
`;

interface IndicatorProps {
  connected: boolean;
}

const Indicator = ({ connected }: IndicatorProps) => (
  <Container connected={connected} />
);

export default Indicator;
