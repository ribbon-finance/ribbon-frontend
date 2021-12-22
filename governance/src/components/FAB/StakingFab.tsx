import React from "react";
import styled from "styled-components";

import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import Logo from "shared/lib/assets/icons/logo";

const FABContainer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0px;
  z-index: 1000;
  height: ${theme.governance.actionBar.height}px;
  width: 100%;

  backdrop-filter: blur(40px);
  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const StakingButton = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 160px;
  background: ${(props) => props.color};

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const FABOffsetContainer = styled.div`
  height: ${theme.governance.actionBar.height}px;
`;
const StakingFAB = () => {
  return (
    <>
      <FABContainer>
        <div className="d-flex ml-5">
          <AssetCircleContainer size={48} color={colors.red}>
            <Logo />
          </AssetCircleContainer>
        </div>
        <div className="d-flex ml-auto">
          <StakingButton color={`${colors.red}1F`} role="button">
            <Title fontSize={14} lineHeight={24} color={colors.red}>
              Stake
            </Title>
          </StakingButton>
          <StakingButton color={`${colors.primaryText}0A`} role="button">
            <Title fontSize={14} lineHeight={24} color={colors.text}>
              Unstake
            </Title>
          </StakingButton>
        </div>
      </FABContainer>
      <FABOffsetContainer />
    </>
  );
};

export default StakingFAB;
