import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useGovernanceGlobalState } from "../../store/store";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import sizes from "shared/lib/designSystem/sizes";
import { formatBigNumber } from "shared/lib/utils/math";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { VotingEscrowAddress } from "shared/lib/constants/constants";
import { useAssetBalance } from "shared/lib/hooks/web3DataContext";
import moment from "moment";
import { BigNumber } from "ethers";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";

const FABContainer = styled.div.attrs({
  className: "d-flex align-items-center",
})`
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

const VerticalDivider = styled.div`
  background-color: ${colors.border};
  width: 1px;
  height: 32px;
`;

const StakingButtonsContainer = styled.div.attrs({
  className: "d-flex ml-auto",
})`
  height: 100%;
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
  const { t } = useTranslation();
  const [, setStakingModal] = useGovernanceGlobalState("stakingModal");
  const [, setUnstakingModal] = useGovernanceGlobalState("unstakingModal");

  const rbnAllowance =
    useTokenAllowance("rbn", VotingEscrowAddress) || BigNumber.from(0);

  const { data: rbnTokenAccount, loading: rbnTokenAccountLoading } =
    useRBNTokenAccount();
  const { balance: veRBNBalance, loading: votingPowerLoading } =
    useAssetBalance("veRBN");
  const loading = rbnTokenAccountLoading || votingPowerLoading;
  const loadingText = useLoadingText();

  const stakeMode = useMemo(() => {
    if (rbnAllowance.isZero()) {
      return "approve";
    }

    if (
      rbnTokenAccount &&
      rbnTokenAccount.lockEndTimestamp &&
      moment().isBefore(moment.unix(rbnTokenAccount.lockEndTimestamp))
    ) {
      return "increase";
    }

    return "stake";
  }, [rbnAllowance, rbnTokenAccount]);

  const fabInfo: {
    veRBNAmount: JSX.Element | string;
    stakedRBNAmount: JSX.Element | string;
    unstakedRBNAmount: JSX.Element | string;
  } = useMemo(() => {
    if (!active) {
      return {
        veRBNAmount: "---",
        stakedRBNAmount: "---",
        unstakedRBNAmount: "---",
      };
    }

    if (loading) {
      return {
        veRBNAmount: loadingText,
        stakedRBNAmount: loadingText,
        unstakedRBNAmount: loadingText,
      };
    }

    return {
      veRBNAmount: formatBigNumber(veRBNBalance),
      stakedRBNAmount: rbnTokenAccount
        ? formatBigNumber(rbnTokenAccount.lockedBalance)
        : "0.00",
      unstakedRBNAmount: rbnTokenAccount
        ? formatBigNumber(rbnTokenAccount.walletBalance)
        : "0.00",
    };
  }, [active, loading, loadingText, rbnTokenAccount, veRBNBalance]);

  const renderDataTooltip = useCallback(
    (title: string, explanation: string, learnMoreURL?: string) => (
      <TooltipExplanation
        title={title}
        explanation={explanation}
        renderContent={({ ref, ...triggerHandler }) => (
          <HelpInfo containerRef={ref} {...triggerHandler}>
            i
          </HelpInfo>
        )}
        learnMoreURL={learnMoreURL}
      />
    ),
    []
  );

  return active ? (
    <>
      <FABContainer>
        <div className="d-flex align-items-center justify-content-center flex-grow-1">
          <div className="d-flex flex-column ml-2">
            <SecondaryText fontSize={10} lineHeight={16}>
              <div className="d-flex">
                {t("shared:TooltipExplanations:veRBN:fabTitle")}
                {renderDataTooltip(
                  t("shared:TooltipExplanations:veRBN:fabTitle"),
                  t("shared:TooltipExplanations:veRBN:description")
                )}
              </div>
            </SecondaryText>
            <Title
              fontSize={14}
              lineHeight={16}
              letterSpacing={1}
              className="mt-1"
            >
              {fabInfo.veRBNAmount}
            </Title>
          </div>
        </div>
        <VerticalDivider />
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
          <SecondaryText fontSize={10} lineHeight={16}>
            <div className="d-flex">
              {t("shared:TooltipExplanations:lockedRBN:title")}
              {renderDataTooltip(
                t("shared:TooltipExplanations:lockedRBN:title"),
                t("shared:TooltipExplanations:lockedRBN:description")
              )}
            </div>
          </SecondaryText>
          <Title
            fontSize={14}
            lineHeight={16}
            letterSpacing={1}
            className="mt-1"
          >
            {fabInfo.stakedRBNAmount}
          </Title>
        </div>
        <VerticalDivider />
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
          <SecondaryText fontSize={10} lineHeight={16}>
            <div className="d-flex">
              {t("shared:TooltipExplanations:unlockedRBN:fabTitle")}
              {renderDataTooltip(
                t("shared:TooltipExplanations:unlockedRBN:fabTitle"),
                t("shared:TooltipExplanations:unlockedRBN:description")
              )}
            </div>
          </SecondaryText>
          <Title
            fontSize={14}
            lineHeight={16}
            letterSpacing={1}
            className="mt-1"
          >
            {fabInfo.unstakedRBNAmount}
          </Title>
        </div>
        <StakingButtonsContainer>
          <StakingButton
            color={`${colors.red}1F`}
            role="button"
            onClick={() =>
              setStakingModal((prev) => ({
                ...prev,
                show: true,
                mode: stakeMode,
              }))
            }
          >
            <Title fontSize={14} lineHeight={24} color={colors.red}>
              LOCK RBN
            </Title>
          </StakingButton>
          <StakingButton
            color={`${colors.primaryText}0A`}
            role="button"
            onClick={() => {
              setUnstakingModal((prev) => ({ ...prev, show: true }));
            }}
          >
            <Title fontSize={14} lineHeight={24} color={colors.text}>
              UNLOCK RBN
            </Title>
          </StakingButton>
        </StakingButtonsContainer>
      </FABContainer>
      <FABOffsetContainer />
    </>
  ) : (
    <></>
  );
};

export default StakingFAB;
