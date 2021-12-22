import React from "react";
import styled from "styled-components";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import { ThemedLogo } from "shared/lib/assets/icons/logo";
import { useGovernanceGlobalState } from "../../store/store";

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
  const [, setShow] = useGovernanceGlobalState("showStakingModal");

  return (
    <>
      <FABContainer>
        <div className="d-flex align-items-center ml-5">
          <AssetCircleContainer size={48} color={colors.red}>
            <ThemedLogo theme={colors.red} />
          </AssetCircleContainer>
          <div className="d-flex flex-column ml-2">
            <SecondaryText fontSize={10} lineHeight={16}>
              Your SRBN / Voting Power
            </SecondaryText>
            <Title
              fontSize={14}
              lineHeight={16}
              letterSpacing={1}
              className="mt-1"
            >
              5,000.00
            </Title>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center ml-auto">
          <SecondaryText fontSize={10} lineHeight={16}>
            Your Locked RBN
          </SecondaryText>
          <Title
            fontSize={14}
            lineHeight={16}
            letterSpacing={1}
            className="mt-1"
          >
            10,000.00
          </Title>
        </div>
        <div className="d-flex ml-auto">
          <StakingButton
            color={`${colors.red}1F`}
            role="button"
            onClick={() => setShow(true)}
          >
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
