import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";

import { SecondaryText, Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useGovernanceGlobalState } from "../../store/store";
import {
  GovernanceApproveUnstakeTransactions,
  GovernanceStakeTransactions,
} from "shared/lib/store/types";
import useTokenAllowance from "shared/lib/hooks/useTokenAllowance";
import sizes from "shared/lib/designSystem/sizes";
import { formatBigNumber } from "shared/lib/utils/math";
import useLoadingText, { LoadingText } from "shared/lib/hooks/useLoadingText";
import { useRBNTokenAccount } from "shared/lib/hooks/useRBNTokenSubgraph";
import { VotingEscrowAddress } from "shared/lib/constants/constants";
import { useAssetBalance } from "shared/lib/hooks/web3DataContext";
import { BigNumber } from "ethers";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";

const FABContainer = styled.div.attrs({
  className: "d-flex align-items-center",
})`
  position: fixed;
  bottom: 0px;
  z-index: 1000;
  height: ${theme.governance.actionBar.height}px;
  width: 100%;

  border-top: 1px solid ${colors.borderDark2};

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

const StakingButton = styled.div<{ color: string; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 160px;
  background: ${(props) =>
    props.isDisabled ? colors.background.two : props.color};
  &:hover {
    opacity: ${(props) => (props.isDisabled ? 1 : theme.hover.opacity)};
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
  const { pendingTransactions } = usePendingTransactions();

  // Lock already ended, user can no longer increase stake duration,
  // and must unlock RBN before locking more.
  const lockExpired = useMemo(() => {
    return Boolean(
      rbnTokenAccount?.lockEndTimestamp &&
        Date.now() > rbnTokenAccount.lockEndTimestamp * 1000
    );
  }, [rbnTokenAccount]);

  const stakeMode = useMemo(() => {
    if (rbnAllowance.isZero()) {
      return "approve";
    }

    // If has current locked RBN and it has not expired, user can only increase
    if (rbnTokenAccount && rbnTokenAccount.lockEndTimestamp && !lockExpired) {
      return "increase";
    }

    return "stake";
  }, [rbnAllowance, rbnTokenAccount, lockExpired]);

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
      veRBNAmount: formatBigNumber(veRBNBalance, 18, 5),
      stakedRBNAmount: rbnTokenAccount
        ? formatBigNumber(rbnTokenAccount.lockedBalance, 18, 5)
        : "0.00",
      unstakedRBNAmount: rbnTokenAccount
        ? formatBigNumber(rbnTokenAccount.walletBalance, 18, 5)
        : "0.00",
    };
  }, [active, loading, loadingText, rbnTokenAccount, veRBNBalance]);

  const lockButtonContent = useMemo(() => {
    const stakeIncreaseOrApprovalTypes: string[] = [
      ...GovernanceStakeTransactions,
      GovernanceApproveUnstakeTransactions[0],
    ];
    const pendingTx = pendingTransactions.find(
      (tx) => stakeIncreaseOrApprovalTypes.includes(tx.type) && !tx.status
    );
    if (pendingTx) {
      if (pendingTx.type === "governanceApproval") {
        return <LoadingText text="APPROVING RBN" />;
      }
      return <LoadingText text="LOCKING RBN" />;
    }
    return "LOCK RBN";
  }, [pendingTransactions]);

  const unlockButtonContent = useMemo(() => {
    const isPending = pendingTransactions.find(
      (tx) => tx.type === "governanceUnstake" && !tx.status
    );
    if (isPending) {
      return <LoadingText text="UNLOCKING RBN" />;
    }
    return "UNLOCK RBN";
  }, [pendingTransactions]);

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
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
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
            onClick={() => {
              if (!lockExpired) {
                setStakingModal((prev) => ({
                  ...prev,
                  show: true,
                  mode: stakeMode,
                }));
              }
            }}
            isDisabled={lockExpired}
          >
            <Title
              fontSize={14}
              lineHeight={24}
              color={lockExpired ? colors.tertiaryText : colors.red}
            >
              {lockButtonContent}
            </Title>
            {lockExpired && (
              <TooltipExplanation
                title={t("governance:TooltipExplanations:lockRBN:title")}
                explanation={t(
                  "governance:TooltipExplanations:lockRBN:description"
                )}
                renderContent={({ ref, ...triggerHandler }) => (
                  <HelpInfo containerRef={ref} {...triggerHandler}>
                    i
                  </HelpInfo>
                )}
              />
            )}
          </StakingButton>
          <StakingButton
            color={`${colors.primaryText}0A`}
            role="button"
            onClick={() => {
              setUnstakingModal((prev) => ({ ...prev, show: true }));
            }}
          >
            <Title fontSize={14} lineHeight={24} color={colors.text}>
              {unlockButtonContent}
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
