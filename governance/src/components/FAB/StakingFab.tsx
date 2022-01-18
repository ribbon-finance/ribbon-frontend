import React from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import { ThemedLogo } from "shared/lib/assets/icons/logo";
import { useGovernanceGlobalState } from "../../store/store";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import { VotingEscrowAddress } from "../../constants/constants";
import sizes from "shared/lib/designSystem/sizes";
import { useAssetBalance } from "shared/lib/hooks/web3DataContext";
import { formatBigNumber } from "shared/lib/utils/math";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";

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

  @media (max-width: ${sizes.md}px) {
    display: none;
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

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;
const StakingFAB = () => {
  const { active } = useWeb3React();
  const [, setStakingModal] = useGovernanceGlobalState("stakingModal");

  const rbnAllowance = useTokenAllowance("rbn", VotingEscrowAddress);
  const { data: rbnAccount, loading: rbnAccountLoading } = useRBNTokenAccount();
  const { balance: votingPower, loading: votingPowerLoading } =
    useAssetBalance("veRBN");
  const loadingText = useTextAnimation(votingPowerLoading || rbnAccountLoading);

  return active ? (
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
              {votingPowerLoading ? loadingText : formatBigNumber(votingPower)}
            </Title>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center ml-auto">
          <SecondaryText fontSize={10} lineHeight={16}>
            Staked / Locked RBN
          </SecondaryText>
          <Title
            fontSize={14}
            lineHeight={16}
            letterSpacing={1}
            className="mt-1"
          >
            {rbnAccountLoading
              ? loadingText
              : rbnAccount
              ? formatBigNumber(rbnAccount.lockedBalance)
              : "0"}
          </Title>
        </div>
        <div className="d-flex flex-column justify-content-center ml-auto">
          <SecondaryText fontSize={10} lineHeight={16}>
            Unstaked RBN
          </SecondaryText>
          <Title
            fontSize={14}
            lineHeight={16}
            letterSpacing={1}
            className="mt-1"
          >
            {rbnAccountLoading
              ? loadingText
              : rbnAccount
              ? formatBigNumber(rbnAccount.walletBalance)
              : "0"}
          </Title>
        </div>
        <div className="d-flex ml-auto">
          <StakingButton
            color={`${colors.red}1F`}
            role="button"
            onClick={() =>
              setStakingModal({
                show: true,
                mode: rbnAllowance?.isZero() ? "approve" : "stake",
              })
            }
          >
            <Title fontSize={14} lineHeight={24} color={colors.red}>
              {rbnAllowance?.isZero() ? "Approve" : "Stake"}
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
  ) : (
    <></>
  );
};

export default StakingFAB;
