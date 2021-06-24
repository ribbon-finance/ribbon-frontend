import React from "react";
import styled from "styled-components";

import { BaseButton, PrimaryText, Title } from "../../../designSystem";
import colors from "../../../designSystem/colors";
import theme from "../../../designSystem/theme";
import { VaultSetFilterProps } from "../types";

const Result = styled(Title)`
  font-size: 18px;
  line-height: 24px;
`;

const Descritpion = styled(PrimaryText)`
  margin-top: 8px;
  color: ${colors.text};
`;

const ClearButton = styled(BaseButton)`
  margin-top: 24px;
  padding: 14px 24px;
  background: ${colors.primaryText}29;
  border-radius: ${theme.border.radius};

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const ClearButtonText = styled(Title)`
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
`;

const EmptyResult: React.FC<
  VaultSetFilterProps & React.HTMLAttributes<HTMLElement>
> = ({ setFilterStrategies, setFilterAssets, ...props }) => (
  <div
    {...props}
    className={`w-100 h-100 d-flex flex-column align-items-center justify-content-center flex-wrap ${props.className}`}
  >
    <Result>NO RESULTS</Result>
    <Descritpion>Pleas try adjusting your filters.</Descritpion>
    <ClearButton
      role="button"
      onClick={() => {
        setFilterAssets([]);
        setFilterStrategies([]);
      }}
    >
      <ClearButtonText>Clear Filters</ClearButtonText>
    </ClearButton>
  </div>
);

export default EmptyResult;
