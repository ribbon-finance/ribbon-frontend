import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

import {
  BaseIndicator,
  SecondaryText,
  Subtitle,
  Title,
} from "shared/lib/designSystem";
import {
  getAssets,
  getDisplayAssets,
  VaultLiquidityMiningMap,
  VaultOptions,
} from "shared/lib/constants/constants";
import theme from "shared/lib/designSystem/theme";
import colors from "shared/lib/designSystem/colors";
import CapBar from "shared/lib/components/Deposit/CapBar";
import useConnectWalletModal from "shared/lib/hooks/useConnectWalletModal";
import { useStakingPoolData } from "shared/lib/hooks/web3DataContext";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import { getAssetDecimals, getAssetLogo } from "shared/lib/utils/asset";
import { formatBigNumber } from "shared/lib/utils/math";
import StakingApprovalModal from "./Modal/StakingApprovalModal";
import { usePendingTransactions } from "shared/lib/hooks/pendingTransactionsContext";
import TooltipExplanation from "shared/lib/components/Common/TooltipExplanation";
import { productCopies } from "shared/lib/components/Product/productCopies";
import StakingActionModal from "./Modal/StakingActionModal";
import sizes from "shared/lib/designSystem/sizes";
import StakingClaimModal from "./Modal/StakingClaimModal";
import HelpInfo from "shared/lib/components/Common/HelpInfo";
import { getVaultColor } from "shared/lib/utils/vault";
import { shimmerKeyframe } from "shared/lib/designSystem/keyframes";
import moment from "moment";
import { BigNumber } from "ethers";

const StakingPoolsContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const StakingPoolCard = styled.div<{ color: string }>`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background: ${colors.background.two};
  border: 2px ${theme.border.style} ${(props) => props.color}00;
  border-radius: ${theme.border.radius};
  margin-bottom: 48px;
  transition: 0.25s border-color ease-out;

  &:hover {
    animation: ${(props) => shimmerKeyframe(props.color)} 3s infinite;
    border: 2px ${theme.border.style} ${(props) => props.color};
  }
`;

const StakingPoolTitle = styled(Title)`
  text-transform: none;
`;

const StakingPoolSubtitle = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  margin-top: 4px;
  color: ${colors.primaryText}52;
`;

const ClaimableTokenPillContainer = styled.div`
  margin-left: auto;

  @media (max-width: ${sizes.sm}px) {
    order: 4;
    width: 100%;
    margin: 24px 0px 8px 0px;
  }
`;

const ClaimableTokenPill = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: ${theme.border.width} ${theme.border.style} ${(props) => props.color};
  background: ${(props) => props.color}14;
  border-radius: 100px;
`;

const ClaimableTokenAmount = styled(Subtitle)<{ color: string }>`
  color: ${(props) => props.color};
  margin-left: auto;
`;

const LogoContainer = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props) => props.color}29;
`;

const PoolRewardData = styled(Title)`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.color};
`;

const StakingPoolCardFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
`;

const StakingPoolCardFooterButton = styled(Title)<{
  active: boolean;
  color: string;
}>`
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  padding: 14px 0;
  text-align: center;
  opacity: ${theme.hover.opacity};

  color: ${(props) => (props.active ? props.color : colors.primaryText)};

  &:hover {
    opacity: 1;
  }

  &:not(:first-child) {
    border-left: ${theme.border.width} ${theme.border.style} ${colors.border};
  }

  @media (max-width: ${sizes.sm}px) {
    flex: unset;
    width: 100%;

    &:not(:first-child) {
      border-left: unset;
      border-top: ${theme.border.width} ${theme.border.style} ${colors.border};
    }
  }
`;

interface StakingPoolProps {
  vaultOption: VaultOptions;
}

const StakingPool: React.FC<StakingPoolProps> = ({ vaultOption }) => {
  const { active } = useWeb3React();
  const [, setShowConnectWalletModal] = useConnectWalletModal();
  const { data: stakingPoolData } = useStakingPoolData(vaultOption);
  const decimals = getAssetDecimals(getAssets(vaultOption));
  const { pendingTransactions } = usePendingTransactions();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isStakeAction, setIsStakeAction] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const color = getVaultColor(vaultOption);
  const ongoingTransaction:
    | "stakingApproval"
    | "stake"
    | "unstake"
    | "rewardClaim"
    | undefined = useMemo(() => {
    const ongoingPendingTx = pendingTransactions.find(
      (currentTx) =>
        ["stakingApproval", "stake", "unstake", "rewardClaim"].includes(
          currentTx.type
        ) &&
        // @ts-ignore
        currentTx.stakeAsset === vaultOption &&
        !currentTx.status
    );

    if (!ongoingPendingTx) {
      return undefined;
    }

    return ongoingPendingTx.type as
      | "stakingApproval"
      | "stake"
      | "unstake"
      | "rewardClaim";
  }, [pendingTransactions, vaultOption]);

  // const hasAllowance = useMemo(() => {
  //   if (!tokenAllowance || tokenAllowance.isZero()) {
  //     return false;
  //   }

  //   setShowApprovalModal(false);

  //   return true;
  // }, [tokenAllowance]);

  const actionLoadingTextBase = useMemo(() => {
    switch (ongoingTransaction) {
      case "stake":
        return "Staking";
      case "stakingApproval":
        return "Approving";
      case "unstake":
        return "Unstaking";
      case "rewardClaim":
        return "Claiming";
      default:
        return "Loading";
    }
  }, [ongoingTransaction]);

  const primaryActionLoadingText = useTextAnimation(
    Boolean(ongoingTransaction),
    {
      texts: [
        actionLoadingTextBase,
        `${actionLoadingTextBase} .`,
        `${actionLoadingTextBase} ..`,
        `${actionLoadingTextBase} ...`,
      ],
      interval: 250,
    }
  );

  const logo = useMemo(() => {
    const asset = getDisplayAssets(vaultOption);
    const Logo = getAssetLogo(asset);

    switch (asset) {
      case "WETH":
        return <Logo height="70%" />;
      default:
        return <Logo />;
    }
  }, [vaultOption]);

  const renderUnstakeBalance = useCallback(() => {
    if (!active) {
      return "---";
    }

    return formatBigNumber(stakingPoolData.unstakedBalance, decimals);
  }, [active, stakingPoolData, decimals]);

  // const renderEstimatedRewards = useCallback(() => {
  //   if (!active || stakingPoolData.currentStake.isZero()) {
  //     return "---";
  //   }

  //   return formatBigNumber(
  //     stakingPoolData.currentStake
  //       .mul(BigNumber.from(10).pow(18))
  //       .div(stakingPoolData.poolSize)
  //       .mul(stakingPoolData.poolRewardForDuration)
  //       .div(BigNumber.from(10).pow(18)),
  //     0
  //   );
  // }, [active, stakingPoolData]);

  const showStakeModal = useMemo(() => {
    if (ongoingTransaction === "stake") {
      /** Always show staking modal when there is ongoing transaction */
      return true;
    } else if (ongoingTransaction === "unstake") {
      /** Likewise with unstaking transaction */
      return false;
    }

    return isStakeAction;
  }, [isStakeAction, ongoingTransaction]);

  const rbnPill = useMemo(() => {
    if (
      moment(stakingPoolData.periodFinish, "X").diff(moment()) &&
      stakingPoolData.claimableRbn.isZero()
    ) {
      return (
        <ClaimableTokenPillContainer>
          <ClaimableTokenPill color={color}>
            <BaseIndicator size={8} color={color} className="mr-2" />
            <Subtitle className="mr-2">AMOUNT CLAIMED</Subtitle>
            <ClaimableTokenAmount color={color}>
              {formatBigNumber(
                stakingPoolData.claimHistory.reduce(
                  (acc, curr) => acc.add(curr.amount),
                  BigNumber.from(0)
                ),
                18,
                2
              )}
            </ClaimableTokenAmount>
          </ClaimableTokenPill>
        </ClaimableTokenPillContainer>
      );
    }

    return (
      <ClaimableTokenPillContainer>
        <ClaimableTokenPill color={color}>
          <BaseIndicator size={8} color={color} className="mr-2" />
          <Subtitle className="mr-2">EARNED $RBN</Subtitle>
          <ClaimableTokenAmount color={color}>
            {active
              ? formatBigNumber(stakingPoolData.claimableRbn, 18, 2)
              : "---"}
          </ClaimableTokenAmount>
        </ClaimableTokenPill>
      </ClaimableTokenPillContainer>
    );
  }, [active, color, stakingPoolData]);

  const stakingPoolButtons = useMemo(() => {
    if (!active) {
      return (
        <StakingPoolCardFooterButton
          role="button"
          color={colors.green}
          onClick={() => {
            setShowConnectWalletModal(true);
          }}
          active={false}
        >
          CONNECT WALLET
        </StakingPoolCardFooterButton>
      );
    }

    if (
      !stakingPoolData.claimableRbn.isZero() ||
      stakingPoolData.claimHistory.length
    ) {
      return (
        <StakingPoolCardFooterButton
          role="button"
          color={color}
          onClick={() => setShowClaimModal(true)}
          active={ongoingTransaction === "rewardClaim"}
        >
          {ongoingTransaction === "rewardClaim"
            ? primaryActionLoadingText
            : `${
                (stakingPoolData.periodFinish &&
                  moment(stakingPoolData.periodFinish, "X").diff(moment()) >
                    0) ||
                stakingPoolData.claimableRbn.isZero()
                  ? "Claim Info"
                  : "Unstake & Claim"
              }`}
        </StakingPoolCardFooterButton>
      );
    }

    return (
      <StakingPoolCardFooterButton
        role="button"
        color={color}
        onClick={() => {
          setShowActionModal(true);
          setIsStakeAction(false);
        }}
        active={ongoingTransaction === "unstake"}
      >
        {ongoingTransaction === "unstake"
          ? primaryActionLoadingText
          : "Unstake"}
      </StakingPoolCardFooterButton>
    );
  }, [
    active,
    color,
    ongoingTransaction,
    primaryActionLoadingText,
    setShowConnectWalletModal,
    stakingPoolData,
  ]);

  return (
    <>
      <StakingApprovalModal
        show={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        stakingPoolData={stakingPoolData}
        vaultOption={vaultOption}
      />
      <StakingActionModal
        stake={showStakeModal}
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={stakingPoolData}
      />
      <StakingClaimModal
        show={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        vaultOption={vaultOption}
        logo={logo}
        stakingPoolData={stakingPoolData}
      />
      <StakingPoolCard color={color}>
        <div className="d-flex flex-wrap w-100 p-3">
          {/* Card Title */}
          <div className="d-flex align-items-center">
            <LogoContainer color={color}>{logo}</LogoContainer>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <StakingPoolTitle>{vaultOption}</StakingPoolTitle>
                <TooltipExplanation
                  title={vaultOption}
                  explanation={
                    productCopies[vaultOption].liquidityMining.explanation
                  }
                  renderContent={({ ref, ...triggerHandler }) => (
                    <HelpInfo containerRef={ref} {...triggerHandler}>
                      i
                    </HelpInfo>
                  )}
                  learnMoreURL="https://gov.ribbon.finance/t/rgp-2-ribbon-liquidity-mining-program/90"
                />
              </div>
              <StakingPoolSubtitle>
                Your Unstaked Balance: {renderUnstakeBalance()}
              </StakingPoolSubtitle>
            </div>
          </div>

          {/* Claimable Pill */}
          {rbnPill}

          {/* Capbar */}
          <div className="w-100 mt-4">
            <CapBar
              loading={false}
              current={parseFloat(
                formatUnits(stakingPoolData.currentStake, decimals)
              )}
              cap={parseFloat(formatUnits(stakingPoolData.poolSize, decimals))}
              copies={{
                current: "Your Current Stake",
                cap: "Pool Size",
              }}
              labelConfig={{
                fontSize: 14,
              }}
              statsConfig={{
                fontSize: 14,
              }}
              barConfig={{
                height: 8,
                extraClassNames: "my-2",
                radius: 2,
              }}
            />
          </div>

          {/* Estimated pool rewards */}
          {/* <div className="d-flex align-items-center mt-4 w-100">
            <div className="d-flex align-items-center">
              <SecondaryText>Your estimated rewards </SecondaryText>
            </div>
            <PoolRewardData className="ml-auto" color={color}>
              {renderEstimatedRewards()} RBN
            </PoolRewardData>
          </div> */}

          {/* Pool reward of duration */}
          <div className="d-flex align-items-center mt-4 w-100">
            <div className="d-flex align-items-center">
              <SecondaryText>Pool rewards </SecondaryText>
            </div>
            <PoolRewardData className="ml-auto">
              {formatBigNumber(stakingPoolData.poolRewardForDuration, 18)} RBN
            </PoolRewardData>
          </div>
        </div>
        <StakingPoolCardFooter>{stakingPoolButtons}</StakingPoolCardFooter>
      </StakingPoolCard>
    </>
  );
};

const StakingPools = () => {
  return (
    <StakingPoolsContainer>
      <Title fontSize={18} lineHeight={24} className="mb-4 w-100">
        STAKING POOLS
      </Title>
      {Object.keys(VaultLiquidityMiningMap).map((option) => (
        <StakingPool key={option} vaultOption={option as VaultOptions} />
      ))}
    </StakingPoolsContainer>
  );
};

export default StakingPools;
